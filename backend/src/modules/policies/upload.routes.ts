import { Router } from "express"
import { UploadController, uploadMiddleware } from "./upload.controller"
import { asyncHandler } from "../../utils/asyncHandler"
/**
 * @openapi
 * /upload:
 *   post:
 *     summary: Upload CSV of policies (insert valid rows, reject invalid/duplicates)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation_id: { type: string }
 *                 correlation_id: { type: string }
 *                 inserted_count: { type: integer }
 *                 rejected_count: { type: integer }
 *                 duplicates_count: { type: integer }
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       row_number: { type: integer }
 *                       field: { type: string }
 *                       code: { type: string }
 *       400:
 *         description: Missing file
 */

export function uploadRoutes() {
  const r = Router()
  const c = new UploadController()

  r.post("/upload", uploadMiddleware, asyncHandler(c.uploadCsv.bind(c)))

  return r
}
