import { Router } from "express"
import { UploadController, uploadMiddleware } from "./upload.controller"
import { asyncHandler } from "../../utils/asyncHandler"

export function uploadRoutes() {
  const r = Router()
  const c = new UploadController()

  r.post("/upload", uploadMiddleware, asyncHandler(c.uploadCsv.bind(c)))

  return r
}
