"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
const prisma_1 = require("../src/db/prisma");
const app = (0, app_1.buildApp)();
beforeAll(async () => {
    await prisma_1.prisma.operation.deleteMany();
    await prisma_1.prisma.policy.deleteMany();
});
afterAll(async () => {
    await prisma_1.prisma.$disconnect();
});
test("POST /upload inserts valid rows and rejects duplicates + invalid", async () => {
    const csv = [
        "policy_number,customer,policy_type,start_date,end_date,premium_usd,status,insured_value_usd",
        "POL-DUP-001,Acme,Property,2025-01-01,2025-12-31,100,active,6000",
        "POL-DUP-001,Acme,Property,2025-01-01,2025-12-31,100,active,6000",
        "POL-BAD-001,Acme,Boat,2025-01-01,2025-12-31,100,active,6000",
    ].join("\n");
    const res = await (0, supertest_1.default)(app)
        .post("/upload")
        .set("x-correlation-id", "test-corr-1")
        .attach("file", Buffer.from(csv), "t.csv");
    expect(res.status).toBe(200);
    expect(res.body.operation_id).toBeTruthy();
    expect(res.body.correlation_id).toBe("test-corr-1");
    expect(res.body.inserted_count).toBe(1);
    expect(res.body.rejected_count).toBe(2);
    expect(res.body.duplicates_count).toBe(1);
    const codes = res.body.errors.map((e) => e.code);
    expect(codes).toContain("DUPLICATE_POLICY_NUMBER");
    expect(codes).toContain("INVALID_POLICY_TYPE");
    const count = await prisma_1.prisma.policy.count();
    expect(count).toBe(1);
});
