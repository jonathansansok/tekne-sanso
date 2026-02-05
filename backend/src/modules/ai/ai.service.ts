import type { Policy } from "@prisma/client"
import { PoliciesRepository } from "../policies/policies.repository"

function normalizePolicyType(x?: string) {
  const v = (x ?? "").trim()
  if (!v) return undefined
  const low = v.toLowerCase()
  if (low === "property") return "Property"
  if (low === "auto") return "Auto"
  return v
}

function normalizeStatus(x?: string) {
  const v = (x ?? "").trim()
  if (!v) return undefined
  const low = v.toLowerCase()
  if (low === "active") return "active"
  if (low === "expired") return "expired"
  if (low === "cancelled") return "cancelled"
  return v
}

function quantile(sorted: number[], q: number) {
  if (sorted.length === 0) return 0
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  if (sorted[base + 1] === undefined) return sorted[base]
  return sorted[base] + rest * (sorted[base + 1] - sorted[base])
}

export class AiService {
  private readonly repo = new PoliciesRepository()

  async insights(input: { filters?: { status?: string; policy_type?: string; q?: string } }) {
    const raw = input.filters ?? {}

    const f = {
      status: normalizeStatus(raw.status),
      policy_type: normalizePolicyType(raw.policy_type),
      q: raw.q,
    }

    const listRes = await this.repo.list({ limit: 100, offset: 0, ...f })
    const summary = await this.repo.summary(f)

    const items = listRes.items as Policy[]
    const filtered_policies = summary.total_policies

    const insights: string[] = []
    let risk_flags = 0

    const minByType: Record<string, number> = { Property: 5000, Auto: 10000 }

    const nearMin = items.filter((p) => {
      const min = minByType[p.policy_type] ?? 0
      if (!min) return false
      const v = Number(p.insured_value_usd)
      return Number.isFinite(v) && v > 0 && v < min * 1.1
    })

    if (nearMin.length > 0) {
      risk_flags += 1
      insights.push(
        `Hay ${nearMin.length} policies con insured_value cerca del minimo (< 1.1x) dentro del filtro.`,
      )
      insights.push(`Recomendacion: alertar cuando insured_value < 1.1x del minimo por tipo.`)
    }

    const byStatus = Object.entries(summary.count_by_status ?? {})
    if (byStatus.length > 0) {
      const sorted = byStatus.sort((a, b) => b[1] - a[1])
      const top = sorted[0]
      if (top && top[1] > 0) {
        risk_flags += 1
        insights.push(`Status dominante: ${top[0]} (${top[1]} policies).`)
        insights.push(`Recomendacion: revisar causas si hay concentracion en cancelled/expired.`)
      }
    }

    const premiums = items
      .map((p) => Number(p.premium_usd))
      .filter((n) => Number.isFinite(n))
      .sort((a, b) => a - b)

    let outliers: number[] = []
    if (premiums.length >= 8) {
      const q1 = quantile(premiums, 0.25)
      const q3 = quantile(premiums, 0.75)
      const iqr = q3 - q1
      const high = q3 + 1.5 * iqr
      const low = q1 - 1.5 * iqr
      outliers = premiums.filter((x) => x > high || x < low)
    }

    if (premiums.length >= 3) {
      const top3 = [...premiums].sort((a, b) => b - a).slice(0, 3)
      risk_flags += 1
      insights.push(`Outliers de premium (top 3): ${top3.map((x) => x.toFixed(2)).join(", ")} USD.`)
      insights.push(`Recomendacion: auditar esas policies por posible riesgo o carga incorrecta.`)
    }

    if (outliers.length > 0) {
      risk_flags += 1
      const examples = [...outliers].sort((a, b) => b - a).slice(0, 3)
      insights.push(`Deteccion IQR: ${outliers.length} premiums outlier. Ejemplos: ${examples.map((x) => x.toFixed(2)).join(", ")} USD.`)
      insights.push(`Recomendacion: aplicar validacion adicional o revisiones manuales en outliers.`)
    }

    if (filtered_policies >= 100) {
      risk_flags += 1
      insights.push(`Volumen alto (>=100) en el conjunto filtrado. Recomendacion: monitorear outliers y near-min por tipo.`)
    }

    return {
      insights: insights.slice(0, 10),
      highlights: {
        total_policies: summary.total_policies,
        filtered_policies,
        risk_flags,
        filters_applied: {
          status: f.status ?? null,
          policy_type: f.policy_type ?? null,
          q: (f.q ?? null) as any,
        },
      },
    }
  }
}
