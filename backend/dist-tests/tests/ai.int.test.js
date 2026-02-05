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
    await prisma_1.prisma.policy.createMany({
        data: [
            {
                policy_number: "POL-AI-1",
                customer: "Acme",
                policy_type: "Property",
                start_date: new Date("2025-01-01"),
                end_date: new Date("2025-12-31"),
                premium_usd: "1200",
                status: "active",
                insured_value_usd: "5100",
            },
            {
                policy_number: "POL-AI-2",
                customer: "Globex",
                policy_type: "Auto",
                start_date: new Date("2025-01-01"),
                end_date: new Date("2025-12-31"),
                premium_usd: "9999",
                status: "active",
                insured_value_usd: "15000",
            },
        ],
    });
});
afterAll(async () => {
    await prisma_1.prisma.$disconnect();
});
test("POST /ai/insights returns insights + highlights", async () => {
    const res = await (0, supertest_1.default)(app)
        .post("/ai/insights")
        .send({ filters: { status: "active" } });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.insights)).toBe(true);
    expect(res.body.highlights).toBeTruthy();
    expect(typeof res.body.highlights.total_policies).toBe("number");
    expect(typeof res.body.highlights.filtered_policies).toBe("number");
    expect(typeof res.body.highlights.risk_flags).toBe("number");
    expect(res.body.highlights.filters_applied.status).toBe("active");
});
