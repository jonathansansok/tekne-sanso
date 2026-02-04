import { prisma } from "../../db/prisma"
import type { Prisma } from "@prisma/client"

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
      count_by_status: Object.fromEntries(byStatus.map(x => [x.status, x._count._all])),
      premium_by_type: Object.fromEntries(byType.map(x => [x.policy_type, x._sum.premium_usd ?? 0])),
    }
  }

  async createManyStrictInsert(rows: Array<{
    policy_number: string
    customer: string
    policy_type: string
    start_date: Date
    end_date: Date
    premium_usd: number
    status: string
    insured_value_usd: number
  }>) {
    const created = await prisma.policy.createMany({
      data: rows.map(r => ({
        policy_number: r.policy_number,
        customer: r.customer,
        policy_type: r.policy_type,
        start_date: r.start_date,
        end_date: r.end_date,
        premium_usd: new prisma.Prisma.Decimal(r.premium_usd),
        status: r.status,
        insured_value_usd: new prisma.Prisma.Decimal(r.insured_value_usd),
      })) as any,
      skipDuplicates: true,
    })

    return created.count
  }
}
