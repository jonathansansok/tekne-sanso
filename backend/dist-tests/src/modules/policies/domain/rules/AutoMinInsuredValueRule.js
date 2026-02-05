"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoMinInsuredValueRule = void 0;
const BusinessRule_1 = require("./BusinessRule");
class AutoMinInsuredValueRule extends BusinessRule_1.BusinessRule {
    validate(input) {
        if (input.policy_type !== "Auto")
            return null;
        if (input.insured_value_usd < 10000) {
            return {
                row_number: input.row_number,
                field: "insured_value_usd",
                code: "AUTO_VALUE_TOO_LOW",
                message: "For Auto policies, insured_value_usd must be >= 10000",
            };
        }
        return null;
    }
}
exports.AutoMinInsuredValueRule = AutoMinInsuredValueRule;
