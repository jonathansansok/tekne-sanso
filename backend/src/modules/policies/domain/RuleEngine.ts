import type { PolicyInput } from "./Policy"
import type { RuleError } from "./errors"
import type { BusinessRule } from "./rules/BusinessRule"

export class RuleEngine {
  constructor(private readonly rules: BusinessRule[]) {}

  apply(input: PolicyInput): RuleError[] {
    const errors: RuleError[] = []
    for (const rule of this.rules) {
      const err = rule.validate(input)
      if (err) errors.push(err)
    }
    return errors
  }
}
