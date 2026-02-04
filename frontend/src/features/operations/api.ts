import { http } from "../../shared/api/http"
import { z } from "zod"

export const OperationSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  endpoint: z.string(),
  status: z.string(),
  correlation_id: z.string(),
  rows_inserted: z.number(),
  rows_rejected: z.number(),
  duration_ms: z.number(),
  error_summary: z.string().nullable().optional(),
})

export type Operation = z.infer<typeof OperationSchema>

export async function getOperation(id: string) {
  const { data } = await http<unknown>(`/operations/${id}`)
  return OperationSchema.parse(data)
}
