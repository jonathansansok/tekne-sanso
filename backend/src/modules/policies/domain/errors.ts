export type RuleError = {
  row_number: number
  field: string
  code: string
  message: string
}

export type ValidationError = {
  row_number: number
  field: string
  code: string
  message: string
}
