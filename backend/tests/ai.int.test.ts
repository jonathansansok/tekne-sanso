import request from "supertest"
import { buildApp } from "../src/app"
import { prisma } from "../src/db/prisma"

const app = buildApp()

beforeAll(async () => {
  await prisma.operation.deleteMany()
  await prisma.policy.deleteMany()

  await prisma.policy.createMany({
    data: [
      {
        policy_number: "POL-AI-1",
        customer: "Acme",
        policy_type: "Property",
        start_date: new Date("2025-01-01"),
        end_date: new Date("2025-12-31"),
        premium_usd: "1200" as any,
        status: "active",
        insured_value_usd: "5100" as any,
      },
      {
        policy_number: "POL-AI-2",
        customer: "Globex",
        policy_type: "Auto",
        start_date: new Date("2025-01-01"),
        end_date: new Date("2025-12-31"),
        premium_usd: "9999" as any,
        status: "active",
        insured_value_usd: "15000" as any,
      },
    ],
  })
})

afterAll(async () => {
  await prisma.$disconnect()
})

test("POST /ai/insights returns insights + highlights", async () => {
  const res = await request(app)
    .post("/ai/insights")
    .send({ filters: { status: "active" } })

  expect(res.status).toBe(200)
  expect(Array.isArray(res.body.insights)).toBe(true)
  expect(res.body.highlights).toBeTruthy()

  expect(typeof res.body.highlights.total_policies).toBe("number")
  expect(typeof res.body.highlights.filtered_policies).toBe("number")
  expect(typeof res.body.highlights.risk_flags).toBe("number")

  expect(res.body.highlights.filters_applied.status).toBe("active")
})
