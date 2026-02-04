import { Router } from "express"
import { AiController } from "./ai.controller"
import { asyncHandler } from "../../utils/asyncHandler"

export function aiRoutes() {
  const r = Router()
  const c = new AiController()

  r.post("/ai/insights", asyncHandler(c.insights.bind(c)))

  return r
}
