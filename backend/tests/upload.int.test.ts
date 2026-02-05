import request from "supertest"
import { buildApp } from "../src/app"
import { prisma } from "../src/db/prisma"

const app = buildApp()

beforeAll(async () => {
  await prisma.operation.deleteMany()
  await prisma.policy.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})

test("POST /upload inserts valid rows and rejects duplicates + invalid", async () => {
  const csv = [
    "policy_number,customer,policy_type,start_date,end_date,premium_usd,status,insured_value_usd",
    "POL-DUP-001,Acme,Property,2025-01-01,2025-12-31,100,active,6000",
    "POL-DUP-001,Acme,Property,2025-01-01,2025-12-31,100,active,6000",
    "POL-BAD-001,Acme,Boat,2025-01-01,2025-12-31,100,active,6000",
  ].join("\n")

  const res = await request(app)
    .post("/upload")
    .set("x-correlation-id", "test-corr-1")
    .attach("file", Buffer.from(csv), "t.csv")

  expect(res.status).toBe(200)
  expect(res.body.operation_id).toBeTruthy()
  expect(res.body.correlation_id).toBe("test-corr-1")

  expect(res.body.inserted_count).toBe(1)
  expect(res.body.rejected_count).toBe(2)
  expect(res.body.duplicates_count).toBe(1)

  const codes = res.body.errors.map((e: any) => e.code)
  expect(codes).toContain("DUPLICATE_POLICY_NUMBER")
  expect(codes).toContain("INVALID_POLICY_TYPE")

  const count = await prisma.policy.count()
  expect(count).toBe(1)
})
