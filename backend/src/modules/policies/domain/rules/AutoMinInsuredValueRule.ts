import { BusinessRule } from "./BusinessRule"
import type { PolicyInput } from "../Policy"

export class AutoMinInsuredValueRule extends BusinessRule {
  validate(input: PolicyInput) {
    if (input.policy_type !== "Auto") return null
    if (input.insured_value_usd < 10000) {
      return {
        row_number: input.row_number,
        field: "insured_value_usd",
        code: "AUTO_VALUE_TOO_LOW",
        message: "For Auto policies, insured_value_usd must be >= 10000",
      }
    }
    return null
  }
}
