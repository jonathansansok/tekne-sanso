"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//backend\tests\rules.test.ts
const PolicyValidator_1 = require("../src/modules/policies/domain/PolicyValidator");
function base(row_number = 1) {
    return {
        row_number,
        policy_number: "POL-TEST-1",
        customer: "Acme",
        policy_type: "Property",
        start_date: new Date("2025-01-01"),
        end_date: new Date("2025-12-31"),
        premium_usd: 100,
        status: "active",
        insured_value_usd: 6000,
    };
}
test("Property rule fails when insured_value_usd < 5000", () => {
    const v = new PolicyValidator_1.PolicyValidator();
    const r = base();
    r.insured_value_usd = 4999;
    const out = v.validate(r);
    expect(out.errors.some((e) => e.code === "PROPERTY_VALUE_TOO_LOW")).toBe(true);
});
test("Auto rule fails when insured_value_usd < 10000", () => {
    const v = new PolicyValidator_1.PolicyValidator();
    const r = base();
    r.policy_type = "Auto";
    r.insured_value_usd = 9999;
    const out = v.validate(r);
    expect(out.errors.some((e) => e.code === "AUTO_VALUE_TOO_LOW")).toBe(true);
});
test("invalid policy_type is rejected", () => {
    const v = new PolicyValidator_1.PolicyValidator();
    const r = base();
    r.policy_type = "Boat";
    const out = v.validate(r);
    expect(out.errors.some((e) => e.code === "INVALID_POLICY_TYPE")).toBe(true);
});
test("invalid numbers are rejected", () => {
    const v = new PolicyValidator_1.PolicyValidator();
    const r = base();
    r.premium_usd = Number("abc");
    const out = v.validate(r);
    expect(out.errors.some((e) => e.code === "INVALID_NUMBER" && e.field === "premium_usd")).toBe(true);
});
