import { Router } from "express"
import { PoliciesController } from "./policies.controller"
import { asyncHandler } from "../../utils/asyncHandler"
/**
 * @openapi
 * /policies:
 *   get:
 *     summary: List policies with pagination and optional filters
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 25, maximum: 100 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, default: 0, minimum: 0 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [active, expired, cancelled] }
 *       - in: query
 *         name: policy_type
 *         schema: { type: string, enum: [Property, Auto] }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Policies list
 *
 * /policies/summary:
 *   get:
 *     summary: Aggregated summary of policies for the given filters
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [active, expired, cancelled] }
 *       - in: query
 *         name: policy_type
 *         schema: { type: string, enum: [Property, Auto] }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Summary response
 */

export function policiesRoutes() {
  const r = Router()
  const c = new PoliciesController()

  r.get("/policies", asyncHandler(c.list.bind(c)))
  r.get("/policies/summary", asyncHandler(c.summary.bind(c)))

  return r
}
