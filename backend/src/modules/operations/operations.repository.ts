import { prisma } from "../../db/prisma"

export class OperationsRepository {
  create(endpoint: string, correlationId: string) {
    return prisma.operation.create({
      data: {
        endpoint,
        status: "RECEIVED",
        correlation_id: correlationId,
      },
    })
  }

  update(id: string, data: {
    status?: string
    rows_inserted?: number
    rows_rejected?: number
    duration_ms?: number
    error_summary?: string | null
  }) {
    return prisma.operation.update({
      where: { id },
      data,
    })
  }

  findById(id: string) {
    return prisma.operation.findUnique({ where: { id } })
  }
}
