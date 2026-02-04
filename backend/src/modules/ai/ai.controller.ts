import type { Request, Response } from "express"
import { z } from "zod"
import { AiService } from "./ai.service"

const BodySchema = z.object({
  filters: z.object({
    status: z.string().optional(),
    policy_type: z.string().optional(),
    q: z.string().optional(),
  }).optional(),
})

export class AiController {
  private readonly service = new AiService()

  async insights(req: Request, res: Response) {
    const body = BodySchema.parse(req.body)
    const result = await this.service.insights(body)
    return res.json(result)
  }
}
