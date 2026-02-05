import type { Policy } from "@prisma/client"
import { PoliciesRepository } from "../policies/policies.repository"

export class AiService {
  private readonly repo = new PoliciesRepository()

  async insights(input: { filters?: { status?: string; policy_type?: string; q?: string } }) {
    const f = input.filters ?? {}
    const listRes = await this.repo.list({ limit: 100, offset: 0, ...f })
    const summary = await this.repo.summary(f)

    const items = listRes.items as Policy[]
    const filtered_total = summary.total_policies

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
      insights.push(`Hay ${nearMin.length} policies con insured_value cerca del minimo (< 1.1x) dentro del filtro.`)
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
      .sort((a, b) => b - a)

    if (premiums.length >= 3) {
      risk_flags += 1
      insights.push(`Outliers de premium (top 3): ${premiums.slice(0, 3).map((x) => x.toFixed(2)).join(", ")} USD.`)
      insights.push(`Recomendacion: auditar esas policies por posible riesgo o carga incorrecta.`)
    }

    if (filtered_total >= 100) {
      risk_flags += 1
      insights.push(`Volumen alto (>=100) en el conjunto filtrado. Recomendacion: monitorear outliers y near-min por tipo.`)
    }

    return {
      insights: insights.slice(0, 10),
      highlights: {
        total_policies: summary.total_policies,
        filtered_policies: filtered_total,
        risk_flags,
        filters_applied: {
          status: f.status ?? null,
          policy_type: f.policy_type ?? null,
          q: f.q ?? null,
        },
      },
    }
  }
}
