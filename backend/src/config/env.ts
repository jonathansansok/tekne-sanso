import { z } from "zod"

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().min(1),
  LOG_LEVEL: z.string().default("info"),
  AI_PROVIDER: z.enum(["heuristic"]).default("heuristic"),
})

export const env = EnvSchema.parse(process.env)
