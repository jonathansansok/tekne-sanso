import { http } from "../../shared/api/http"
import { PoliciesSummarySchema } from "../../shared/api/schemas"

export async function getSummary(params?: { status?: string; policy_type?: string; q?: string }) {
  const qs = new URLSearchParams()
  if (params?.status) qs.set("status", params.status)
  if (params?.policy_type) qs.set("policy_type", params.policy_type)
  if (params?.q) qs.set("q", params.q)

  const { data } = await http<unknown>(`/policies/summary?${qs.toString()}`)
  return PoliciesSummarySchema.parse(data)
}
