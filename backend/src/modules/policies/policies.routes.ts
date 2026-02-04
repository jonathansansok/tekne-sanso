import { Router } from "express"
import { PoliciesController } from "./policies.controller"

export function policiesRoutes() {
  const r = Router()
  const c = new PoliciesController()
  r.get("/policies", c.list.bind(c))
  r.get("/policies/summary", c.summary.bind(c))
  return r
}
