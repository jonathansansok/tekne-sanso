import { useQuery } from "@tanstack/react-query"
import { getPolicies } from "./api"
import type { PoliciesList } from "../../shared/api/schemas"
export { useAiInsights as useInsights } from "../ai"

export function usePolicies(params: {
  limit: number
  offset: number
  status?: string
  policy_type?: string
  q?: string
}) {
  return useQuery<PoliciesList>({
    queryKey: ["policies", params],
    queryFn: () => getPolicies(params),
    staleTime: 10_000,
  })
}
