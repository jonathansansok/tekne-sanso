import { Router } from "express"
import { OperationsController } from "./operations.controller"
import { asyncHandler } from "../../utils/asyncHandler"
/**
 * @openapi
 * /operations/{id}:
 *   get:
 *     summary: Get operation by id (traceability for uploads)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Operation
 *       404:
 *         description: Not found
 */

export function operationsRoutes() {
  const r = Router()
  const c = new OperationsController()

  r.get("/operations/:id", asyncHandler(c.getById.bind(c)))

  return r
}
