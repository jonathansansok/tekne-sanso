import { Router } from "express"
import { AiController } from "./ai.controller"
import { asyncHandler } from "../../utils/asyncHandler"
/**
 * @openapi
 * /ai/insights:
 *   post:
 *     summary: Heuristic AI insights for current policies (based on filters)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filters:
 *                 type: object
 *                 properties:
 *                   status: { type: string }
 *                   policy_type: { type: string }
 *                   q: { type: string }
 *     responses:
 *       200:
 *         description: Insights + highlights
 */

export function aiRoutes() {
  const r = Router()
  const c = new AiController()

  r.post("/ai/insights", asyncHandler(c.insights.bind(c)))

  return r
}
