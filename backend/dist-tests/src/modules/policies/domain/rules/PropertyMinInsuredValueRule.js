"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyMinInsuredValueRule = void 0;
const BusinessRule_1 = require("./BusinessRule");
class PropertyMinInsuredValueRule extends BusinessRule_1.BusinessRule {
    validate(input) {
        if (input.policy_type !== "Property")
            return null;
        if (input.insured_value_usd < 5000) {
            return {
                row_number: input.row_number,
                field: "insured_value_usd",
                code: "PROPERTY_VALUE_TOO_LOW",
                message: "For Property policies, insured_value_usd must be >= 5000",
            };
        }
        return null;
    }
}
exports.PropertyMinInsuredValueRule = PropertyMinInsuredValueRule;
