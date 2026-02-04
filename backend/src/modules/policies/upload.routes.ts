import { Router } from "express"
import { UploadController, uploadMiddleware } from "./upload.controller"

export function uploadRoutes() {
  const r = Router()
  const c = new UploadController()
  r.post("/upload", uploadMiddleware, c.uploadCsv.bind(c))
  return r
}
