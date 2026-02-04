import type { PolicyInput } from "./Policy"
import type { ValidationError, RuleError } from "./errors"
import { RuleEngine } from "./RuleEngine"
import { AutoMinInsuredValueRule } from "./rules/AutoMinInsuredValueRule"
import { PropertyMinInsuredValueRule } from "./rules/PropertyMinInsuredValueRule"

const ALLOWED_STATUS = new Set(["active", "expired", "cancelled"])

export class PolicyValidator {
  private readonly engine = new RuleEngine([
    new PropertyMinInsuredValueRule(),
    new AutoMinInsuredValueRule(),
  ])

  validate(input: PolicyInput): { errors: Array<ValidationError | RuleError> } {
    const errors: Array<ValidationError | RuleError> = []

    if (!input.policy_number?.trim()) {
      errors.push({
        row_number: input.row_number,
        field: "policy_number",
        code: "REQUIRED",
        message: "policy_number is required",
      })
    }

    if (!(input.start_date instanceof Date) || isNaN(input.start_date.getTime())) {
      errors.push({
        row_number: input.row_number,
        field: "start_date",
        code: "INVALID_DATE",
        message: "start_date is invalid",
      })
    }

    if (!(input.end_date instanceof Date) || isNaN(input.end_date.getTime())) {
      errors.push({
        row_number: input.row_number,
        field: "end_date",
        code: "INVALID_DATE",
        message: "end_date is invalid",
      })
    }

    if (
      input.start_date instanceof Date &&
      input.end_date instanceof Date &&
      !isNaN(input.start_date.getTime()) &&
      !isNaN(input.end_date.getTime()) &&
      input.start_date >= input.end_date
    ) {
      errors.push({
        row_number: input.row_number,
        field: "start_date",
        code: "DATE_RANGE_INVALID",
        message: "start_date must be < end_date",
      })
    }

    if (!ALLOWED_STATUS.has(input.status)) {
      errors.push({
        row_number: input.row_number,
        field: "status",
        code: "INVALID_STATUS",
        message: "status must be one of: active, expired, cancelled",
      })
    }

    if (errors.length > 0) return { errors }

    const ruleErrors = this.engine.apply(input)
    return { errors: [...errors, ...ruleErrors] }
  }
}
