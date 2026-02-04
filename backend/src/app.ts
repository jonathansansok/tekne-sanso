import express from "express"
import cors from "cors"
import { correlationMiddleware } from "./middleware/correlation.middleware"
import { requestLoggerMiddleware } from "./middleware/request-logger.middleware"
import { errorMiddleware } from "./middleware/error.middleware"
import { uploadRoutes } from "./modules/policies/upload.routes"
import { policiesRoutes } from "./modules/policies/policies.routes"
import { aiRoutes } from "./modules/ai/ai.routes"

export function buildApp() {
  const app = express()

  app.use(cors({ origin: true }))
  app.use(express.json({ limit: "2mb" }))

  app.use(correlationMiddleware)
  app.use(requestLoggerMiddleware)

  app.use(uploadRoutes())
  app.use(policiesRoutes())
  app.use(aiRoutes())

  app.get("/health", (_req, res) => res.json({ ok: true }))

  app.use(errorMiddleware)
  return app
}
