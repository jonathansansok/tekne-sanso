import { BusinessRule } from "./BusinessRule"
import type { PolicyInput } from "../Policy"

export class PropertyMinInsuredValueRule extends BusinessRule {
  validate(input: PolicyInput) {
    if (input.policy_type !== "Property") return null
    if (input.insured_value_usd < 5000) {
      return {
        row_number: input.row_number,
        field: "insured_value_usd",
        code: "PROPERTY_VALUE_TOO_LOW",
        message: "For Property policies, insured_value_usd must be >= 5000",
      }
    }
    return null
  }
}
