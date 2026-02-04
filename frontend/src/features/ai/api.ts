import { http } from "../../shared/api/http"
import { InsightsResponseSchema } from "../../shared/api/schemas"
import type { InsightsResponse } from "../../shared/api/schemas"

export async function postAiInsights(input: {
  filters?: { status?: string; policy_type?: string; q?: string }
}): Promise<InsightsResponse> {
  const { data } = await http<unknown>(`/ai/insights`, {
    method: "POST",
    body: JSON.stringify(input),
  })
  return InsightsResponseSchema.parse(data)
}
