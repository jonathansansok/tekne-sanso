import { useMutation } from "@tanstack/react-query"
import { postAiInsights } from "./api"
import type { InsightsResponse } from "../../shared/api/schemas"

export function useAiInsights() {
  return useMutation<
    InsightsResponse,
    unknown,
    { filters?: { status?: string; policy_type?: string; q?: string } }
  >({
    mutationFn: (input) => postAiInsights(input),
  })
}
