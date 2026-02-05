"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvParser = csvParser;
const csv_parse_1 = require("csv-parse");
function csvParser() {
    return (0, csv_parse_1.parse)({
        columns: true,
        trim: true,
        skip_empty_lines: true,
    });
}
