import { prisma } from "../../db/prisma"
import { Prisma } from "@prisma/client"

export type PolicyCreateRow = {
  policy_number: string
  customer: string
  policy_type: string
  start_date: Date
  end_date: Date
  premium_usd: number
  status: string
  insured_value_usd: number
}

export class PoliciesRepository {
  async list(params: {
    limit: number
    offset: number
    status?: string
    policy_type?: string
    q?: string
  }) {
    const where: Prisma.PolicyWhereInput = {}

    if (params.status) where.status = params.status
    if (params.policy_type) where.policy_type = params.policy_type

    if (params.q && params.q.trim()) {
      const q = params.q.trim()
      where.OR = [
        { policy_number: { contains: q, mode: "insensitive" } },
        { customer: { contains: q, mode: "insensitive" } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.policy.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: params.limit,
        skip: params.offset,
      }),
      prisma.policy.count({ where }),
    ])

    return { items, total }
  }

  async summary(params: { status?: string; policy_type?: string; q?: string }) {
    const where: Prisma.PolicyWhereInput = {}

    if (params.status) where.status = params.status
    if (params.policy_type) where.policy_type = params.policy_type

    if (params.q && params.q.trim()) {
      const q = params.q.trim()
      where.OR = [
        { policy_number: { contains: q, mode: "insensitive" } },
        { customer: { contains: q, mode: "insensitive" } },
      ]
    }

    const [total_policies, sumPremium] = await Promise.all([
      prisma.policy.count({ where }),
      prisma.policy.aggregate({
        where,
        _sum: { premium_usd: true },
      }),
    ])

    const byStatus = await prisma.policy.groupBy({
      where,
      by: ["status"],
      _count: { _all: true },
    })

    const byType = await prisma.policy.groupBy({
      where,
      by: ["policy_type"],
      _sum: { premium_usd: true },
    })

    return {
      total_policies,
      total_premium_usd: sumPremium._sum.premium_usd ?? 0,
      count_by_status: Object.fromEntries(byStatus.map((x) => [x.status, x._count._all])),
      premium_by_type: Object.fromEntries(byType.map((x) => [x.policy_type, x._sum.premium_usd ?? 0])),
    }
  }

  async createOneStrict(row: PolicyCreateRow): Promise<"inserted" | "duplicate"> {
    try {
      await prisma.policy.create({
        data: {
          policy_number: row.policy_number,
          customer: row.customer,
          policy_type: row.policy_type,
          start_date: row.start_date,
          end_date: row.end_date,
          premium_usd: new Prisma.Decimal(row.premium_usd),
          status: row.status,
          insured_value_usd: new Prisma.Decimal(row.insured_value_usd),
        },
      })
      return "inserted"
    } catch (e: any) {
      if (e?.code === "P2002") return "duplicate"
      throw e
    }
  }
}
