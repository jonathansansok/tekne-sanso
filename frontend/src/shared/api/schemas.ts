//frontend\src\shared\api\schemas.ts
import { z } from "zod"

export const PolicySchema = z.object({
  id: z.string(),
  policy_number: z.string(),
  customer: z.string(),
  policy_type: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  premium_usd: z.union([z.string(), z.number()]),
  status: z.string(),
  insured_value_usd: z.union([z.string(), z.number()]),
  created_at: z.string(),
})

export const PoliciesListSchema = z.object({
  items: z.array(PolicySchema),
  pagination: z.object({
    limit: z.number(),
    offset: z.number(),
    total: z.number(),
  }),
})

export const PoliciesSummarySchema = z.object({
  total_policies: z.number(),
  total_premium_usd: z.union([z.string(), z.number()]),
  count_by_status: z.record(z.string(), z.number()),
  premium_by_type: z.record(z.string(), z.union([z.string(), z.number()])),
})

export const UploadErrorSchema = z.object({
  row_number: z.number(),
  field: z.string(),
  code: z.string(),
})

export const UploadResponseSchema = z.object({
  operation_id: z.string(),
  correlation_id: z.string(),
  inserted_count: z.number(),
  rejected_count: z.number(),
  duplicates_count: z.number().optional(),
  errors: z.array(UploadErrorSchema),
})

export const InsightsResponseSchema = z.object({
  insights: z.array(z.string()),
  highlights: z.object({
    total_policies: z.number(),
    risk_flags: z.number(),
  }),
})

export type Policy = z.infer<typeof PolicySchema>
export type PoliciesList = z.infer<typeof PoliciesListSchema>
export type PoliciesSummary = z.infer<typeof PoliciesSummarySchema>
export type UploadError = z.infer<typeof UploadErrorSchema>
export type UploadResponse = z.infer<typeof UploadResponseSchema>
export type InsightsResponse = z.infer<typeof InsightsResponseSchema>
