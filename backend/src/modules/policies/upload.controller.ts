import type { Request, Response } from "express"
import multer from "multer"
import { UploadService } from "./upload.service"
import { logger } from "../../config/logger"

const upload = multer({ storage: multer.memoryStorage() })

export const uploadMiddleware = upload.single("file")

export class UploadController {
  private readonly service = new UploadService()

  async uploadCsv(req: Request, res: Response) {
    const correlationId = req.correlationId!

    if (!req.file?.buffer) {
      return res.status(400).json({
        code: "FILE_REQUIRED",
        message: "CSV file is required as form-data field 'file'",
        correlation_id: correlationId,
      })
    }

    const result = await this.service.processCsv({
      fileStream: require("stream").Readable.from(req.file.buffer),
      correlationId,
    })

    logger.info({
      correlation_id: correlationId,
      operation_id: result.operation_id,
      endpoint: "POST /upload",
      inserted: result.inserted_count,
      rejected: result.rejected_count,
    })

    return res.status(200).json(result)
  }
}
