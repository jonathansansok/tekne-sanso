import type { Request, Response, NextFunction } from "express"
import { logger } from "../config/logger"

export function errorMiddleware(err: any, req: Request, res: Response, _next: NextFunction) {
  logger.error({
    correlation_id: req.correlationId,
    endpoint: `${req.method} ${req.originalUrl}`,
    error: err?.message ?? String(err),
  })

  res.status(500).json({
    code: "INTERNAL_ERROR",
    message: "Unexpected server error",
    correlation_id: req.correlationId,
  })
}
