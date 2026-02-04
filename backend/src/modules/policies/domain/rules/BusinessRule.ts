import type { PolicyInput } from "../Policy"
import type { RuleError } from "../errors"

export abstract class BusinessRule {
  abstract validate(input: PolicyInput): RuleError | null
}
