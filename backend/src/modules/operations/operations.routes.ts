import { Router } from "express"
import { OperationsController } from "./operations.controller"
import { asyncHandler } from "../../utils/asyncHandler"

export function operationsRoutes() {
  const r = Router()
  const c = new OperationsController()

  r.get("/operations/:id", asyncHandler(c.getById.bind(c)))

  return r
}
