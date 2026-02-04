//backend\src\modules\ai\ai.service.ts
import type { Policy } from "@prisma/client";
import { PoliciesRepository } from "../policies/policies.repository";

export class AiService {
  private readonly repo = new PoliciesRepository();

  async insights(input: {
    filters?: { status?: string; policy_type?: string; q?: string };
  }) {
    const f = input.filters ?? {};
    const { items, total } = await this.repo.list({ limit: 100, offset: 0, ...f });
    const summary = await this.repo.summary(f);

    const insights: string[] = [];
    let risk_flags = 0;

    const minByType: Record<string, number> = { Property: 5000, Auto: 10000 };

    const nearMin = (items as Policy[]).filter((p: Policy) => {
      const min = minByType[p.policy_type] ?? 0;
      if (!min) return false;
      const v = Number(p.insured_value_usd);
      return v > 0 && v < min * 1.1;
    });

    if (nearMin.length > 0) {
      risk_flags += 1;
      insights.push(
        `Hay ${nearMin.length} pólizas con insured_value cerca del mínimo ( < 1.1x ).`,
      );
      insights.push(
        `Recomendación: generar alerta cuando insured_value < 1.1x del mínimo por tipo.`,
      );
    }

    const byTypeEntries = Object.entries(summary.premium_by_type ?? {});
    if (byTypeEntries.length > 0) {
      const sorted = byTypeEntries.sort((a, b) => Number(b[1]) - Number(a[1]));
      const top = sorted[0];
      if (top) {
        risk_flags += 1;
        insights.push(
          `Concentración de premium en ${top[0]}: ${Number(top[1]).toFixed(2)} USD.`,
        );
        insights.push(
          `Recomendación: revisar exposición por tipo y diversificación del portafolio.`,
        );
      }
    }

    if (total >= 100) {
      risk_flags += 1;
      insights.push(
        `Volumen alto (>=100). Recomendación: monitoreo de outliers de premium y asegurado.`,
      );
    }

    return {
      insights: insights.slice(0, 10),
      highlights: {
        total_policies: summary.total_policies,
        risk_flags,
      },
    };
  }
}
