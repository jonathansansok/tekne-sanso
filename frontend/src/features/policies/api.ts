import { http } from "../../shared/api/http"
import { PoliciesListSchema, InsightsResponseSchema } from "../../shared/api/schemas"
import type { PoliciesList, InsightsResponse } from "../../shared/api/schemas"

export async function getPolicies(params: {
  limit: number
  offset: number
  status?: string
  policy_type?: string
  q?: string
}): Promise<PoliciesList> {
  const qs = new URLSearchParams()
  qs.set("limit", String(params.limit))
  qs.set("offset", String(params.offset))
  if (params.status) qs.set("status", params.status)
  if (params.policy_type) qs.set("policy_type", params.policy_type)
  if (params.q) qs.set("q", params.q)

  const { data } = await http<unknown>(`/policies?${qs.toString()}`)
  return PoliciesListSchema.parse(data)
}

export async function generateInsights(input: {
  filters?: { status?: string; policy_type?: string; q?: string }
}): Promise<InsightsResponse> {
  const { data } = await http<unknown>(`/ai/insights`, {
    method: "POST",
    body: JSON.stringify(input),
  })
  return InsightsResponseSchema.parse(data)
}
