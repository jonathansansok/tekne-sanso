import { parse } from "csv-parse"

export function csvParser() {
  return parse({
    columns: true,
    trim: true,
    skip_empty_lines: true,
  })
}
