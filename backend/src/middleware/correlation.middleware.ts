import type { Request, Response, NextFunction } from "express"
import { randomUUID } from "crypto"

declare global {
  namespace Express {
    interface Request {
      correlationId?: string
    }
  }
}

export function correlationMiddleware(req: Request, res: Response, next: NextFunction) {
  const incoming = req.header("x-correlation-id")
  const correlationId = incoming && incoming.trim() ? incoming.trim() : randomUUID()
  req.correlationId = correlationId
  res.setHeader("x-correlation-id", correlationId)
  next()
}
