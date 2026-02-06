import express from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./swagger"
import { correlationMiddleware } from "./middleware/correlation.middleware"
import { requestLoggerMiddleware } from "./middleware/request-logger.middleware"
import { errorMiddleware } from "./middleware/error.middleware"
import { uploadRoutes } from "./modules/policies/upload.routes"
import { policiesRoutes } from "./modules/policies/policies.routes"
import { aiRoutes } from "./modules/ai/ai.routes"
import { operationsRoutes } from "./modules/operations/operations.routes"

export function buildApp() {
  const app = express()

  /**
   * @openapi
   * /health:
   *   get:
   *     summary: Health check
   *     responses:
   *       200:
   *         description: OK
   */
  app.get("/health", (_req, res) => {
    return res.status(200).json({ ok: true })
  })

  app.use(cors({ origin: true }))
  app.use(express.json({ limit: "2mb" }))

  app.use(correlationMiddleware)
  app.use(requestLoggerMiddleware)

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  app.use(operationsRoutes())
  app.use(uploadRoutes())
  app.use(policiesRoutes())
  app.use(aiRoutes())

  app.use(errorMiddleware)
  return app
}
