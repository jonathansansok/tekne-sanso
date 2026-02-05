import type { Request, Response } from "express"
import { z } from "zod"
import { PoliciesService } from "./policies.service"

const ListQuery = z.object({
  limit: z.coerce.number().default(25).refine(v => v <= 100, "limit max is 100"),
offset: z.coerce.number().default(0).refine(v => v >= 0, "offset must be >= 0"),

  status: z.string().optional(),
  policy_type: z.string().optional(),
  q: z.string().optional(),
})

export class PoliciesController {
  private readonly service = new PoliciesService()

  async list(req: Request, res: Response) {
    const q = ListQuery.parse(req.query)

    const { items, total } = await this.service.list({
      limit: q.limit,
      offset: q.offset,
      status: q.status,
      policy_type: q.policy_type,
      q: q.q,
    })

    return res.json({
      items,
      pagination: { limit: q.limit, offset: q.offset, total },
    })
  }

  async summary(req: Request, res: Response) {
    const q = ListQuery.omit({ limit: true, offset: true }).parse(req.query)

    const result = await this.service.summary({
      status: q.status,
      policy_type: q.policy_type,
      q: q.q,
    })

    return res.json(result)
  }
}
