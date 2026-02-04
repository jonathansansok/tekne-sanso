import type { Readable } from "stream"
import { csvParser } from "../../utils/csv"
import { PolicyValidator } from "./domain/PolicyValidator"
import { PoliciesRepository } from "./policies.repository"
import { OperationsRepository } from "../operations/operations.repository"

export class UploadService {
  private readonly validator = new PolicyValidator()
  private readonly policiesRepo = new PoliciesRepository()
  private readonly opsRepo = new OperationsRepository()

  async processCsv(params: {
    fileStream: Readable
    correlationId: string
  }) {
    const endpoint = "POST /upload"
    const op = await this.opsRepo.create(endpoint, params.correlationId)
    const operation_id = op.id
    const correlation_id = op.correlation_id

    const started = Date.now()
    await this.opsRepo.update(operation_id, { status: "PROCESSING" })

    const errors: Array<{ row_number: number; field: string; code: string; message?: string }> = []
    const validRows: Array<{
      policy_number: string
      customer: string
      policy_type: string
      start_date: Date
      end_date: Date
      premium_usd: number
      status: string
      insured_value_usd: number
    }> = []

    let row_number = 0

    try {
      const parser = params.fileStream.pipe(csvParser())

      for await (const record of parser as any) {
        row_number += 1

        const input = {
          row_number,
          policy_number: String(record.policy_number ?? ""),
          customer: String(record.customer ?? ""),
          policy_type: String(record.policy_type ?? ""),
          start_date: new Date(String(record.start_date ?? "")),
          end_date: new Date(String(record.end_date ?? "")),
          premium_usd: Number(record.premium_usd),
          status: String(record.status ?? ""),
          insured_value_usd: Number(record.insured_value_usd),
        }

        const v = this.validator.validate(input)
        if (v.errors.length > 0) {
          for (const e of v.errors) {
            errors.push({
              row_number: e.row_number,
              field: e.field,
              code: e.code,
              message: e.message,
            })
          }
          continue
        }

        validRows.push({
          policy_number: input.policy_number,
          customer: input.customer,
          policy_type: input.policy_type,
          start_date: input.start_date,
          end_date: input.end_date,
          premium_usd: input.premium_usd,
          status: input.status,
          insured_value_usd: input.insured_value_usd,
        })
      }

      const inserted_count = validRows.length > 0
        ? await this.policiesRepo.createManyStrictInsert(validRows)
        : 0

      const rejected_count = errors.length

      const duration_ms = Date.now() - started

      await this.opsRepo.update(operation_id, {
        status: "COMPLETED",
        rows_inserted: inserted_count,
        rows_rejected: rejected_count,
        duration_ms,
        error_summary: rejected_count ? `${rejected_count} validation/rule errors` : null,
      })

      return {
        operation_id,
        correlation_id,
        inserted_count,
        rejected_count,
        errors: errors.map(e => ({
          row_number: e.row_number,
          field: e.field,
          code: e.code,
        })),
      }
    } catch (err: any) {
      const duration_ms = Date.now() - started
      await this.opsRepo.update(operation_id, {
        status: "FAILED",
        duration_ms,
        error_summary: err?.message ?? "upload_failed",
      })
      throw err
    }
  }
}
