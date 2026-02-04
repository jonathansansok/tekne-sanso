import { useQuery } from "@tanstack/react-query"
import { getOperation } from "./api"

export function useOperation(id?: string, enabled = false) {
  return useQuery({
    queryKey: ["operation", id],
    queryFn: () => getOperation(id!),
    enabled: !!id && enabled,
    refetchInterval: (q) => {
      const s = q.state.data?.status
      if (!s) return 1000
      if (s === "COMPLETED" || s === "FAILED") return false
      return 1000
    },
  })
}
