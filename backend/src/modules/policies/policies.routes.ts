import { Router } from "express"
import { PoliciesController } from "./policies.controller"
import { asyncHandler } from "../../utils/asyncHandler"

export function policiesRoutes() {
  const r = Router()
  const c = new PoliciesController()

  r.get("/policies", asyncHandler(c.list.bind(c)))
  r.get("/policies/summary", asyncHandler(c.summary.bind(c)))

  return r
}
