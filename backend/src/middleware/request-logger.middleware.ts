import type { Request, Response, NextFunction } from "express"
import { logger } from "../config/logger"

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()

  res.on("finish", () => {
    const duration_ms = Date.now() - start
    logger.info({
      correlation_id: req.correlationId,
      endpoint: `${req.method} ${req.originalUrl}`,
      statusCode: res.statusCode,
      duration_ms,
    })
  })

  next()
}
