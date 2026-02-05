import type { PolicyInput } from "./Policy"
import type { ValidationError, RuleError } from "./errors"
import { RuleEngine } from "./RuleEngine"
import { AutoMinInsuredValueRule } from "./rules/AutoMinInsuredValueRule"
import { PropertyMinInsuredValueRule } from "./rules/PropertyMinInsuredValueRule"

const ALLOWED_STATUS = new Set(["active", "expired", "cancelled"])
const ALLOWED_TYPES = new Set(["Property", "Auto"])
const ALLOWED_POLICY_TYPE = new Set(["Property", "Auto"])

export class PolicyValidator {
  private readonly engine = new RuleEngine([
    new PropertyMinInsuredValueRule(),
    new AutoMinInsuredValueRule(),
  ])

  validate(input: PolicyInput): { errors: Array<ValidationError | RuleError> } {
    const errors: Array<ValidationError | RuleError> = []

    if (!input.policy_number?.trim()) {
      errors.push({ row_number: input.row_number, field: "policy_number", code: "REQUIRED", message: "policy_number is required" })
    }

    if (!ALLOWED_TYPES.has(input.policy_type)) {
      errors.push({
        row_number: input.row_number,
        field: "policy_type",
        code: "INVALID_POLICY_TYPE",
        message: "policy_type must be one of: Property, Auto",
      })
    }

    if (!(input.start_date instanceof Date) || isNaN(input.start_date.getTime())) {
      errors.push({ row_number: input.row_number, field: "start_date", code: "INVALID_DATE", message: "start_date is invalid" })
    }

    if (!(input.end_date instanceof Date) || isNaN(input.end_date.getTime())) {
      errors.push({ row_number: input.row_number, field: "end_date", code: "INVALID_DATE", message: "end_date is invalid" })
    }

    if (
      input.start_date instanceof Date &&
      input.end_date instanceof Date &&
      !isNaN(input.start_date.getTime()) &&
      !isNaN(input.end_date.getTime()) &&
      input.start_date >= input.end_date
    ) {
      errors.push({ row_number: input.row_number, field: "start_date", code: "DATE_RANGE_INVALID", message: "start_date must be < end_date" })
    }

    if (!ALLOWED_STATUS.has(input.status)) {
      errors.push({
        row_number: input.row_number,
        field: "status",
        code: "INVALID_STATUS",
        message: "status must be one of: active, expired, cancelled",
      })
    }

    if (!Number.isFinite(input.premium_usd)) {
      errors.push({
        row_number: input.row_number,
        field: "premium_usd",
        code: "INVALID_NUMBER",
        message: "premium_usd must be a valid number",
      })
    }

    if (!Number.isFinite(input.insured_value_usd)) {
      errors.push({
        row_number: input.row_number,
        field: "insured_value_usd",
        code: "INVALID_NUMBER",
        message: "insured_value_usd must be a valid number",
      })
    }
if (!ALLOWED_POLICY_TYPE.has(input.policy_type)) {
  errors.push({
    row_number: input.row_number,
    field: "policy_type",
    code: "INVALID_POLICY_TYPE",
    message: "policy_type must be one of: Property, Auto",
  })
}

if (typeof input.premium_usd !== "number" || Number.isNaN(input.premium_usd)) {
  errors.push({
    row_number: input.row_number,
    field: "premium_usd",
    code: "INVALID_NUMBER",
    message: "premium_usd must be a valid number",
  })
}

if (typeof input.insured_value_usd !== "number" || Number.isNaN(input.insured_value_usd)) {
  errors.push({
    row_number: input.row_number,
    field: "insured_value_usd",
    code: "INVALID_NUMBER",
    message: "insured_value_usd must be a valid number",
  })
}

    if (errors.length > 0) return { errors }

    const ruleErrors = this.engine.apply(input)
    return { errors: [...errors, ...ruleErrors] }
  }
}
