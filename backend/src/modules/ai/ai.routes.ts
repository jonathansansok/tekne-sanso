import { Router } from "express"
import { AiController } from "./ai.controller"

export function aiRoutes() {
  const r = Router()
  const c = new AiController()
  r.post("/ai/insights", c.insights.bind(c))
  return r
}
