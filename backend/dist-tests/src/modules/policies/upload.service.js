"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const csv_1 = require("../../utils/csv");
const PolicyValidator_1 = require("./domain/PolicyValidator");
const policies_repository_1 = require("./policies.repository");
const operations_repository_1 = require("../operations/operations.repository");
class UploadService {
    validator = new PolicyValidator_1.PolicyValidator();
    policiesRepo = new policies_repository_1.PoliciesRepository();
    opsRepo = new operations_repository_1.OperationsRepository();
    async processCsv(params) {
        const endpoint = "POST /upload";
        const op = await this.opsRepo.create(endpoint, params.correlationId);
        const operation_id = op.id;
        const correlation_id = op.correlation_id;
        const started = Date.now();
        await this.opsRepo.update(operation_id, { status: "PROCESSING" });
        const errors = [];
        let inserted_count = 0;
        let duplicates_count = 0;
        let row_number = 0;
        try {
            const parser = params.fileStream.pipe((0, csv_1.csvParser)());
            for await (const record of parser) {
                row_number += 1;
                const input = {
                    row_number,
                    policy_number: String(record.policy_number ?? ""),
                    customer: String(record.customer ?? ""),
                    policy_type: String(record.policy_type ?? ""),
                    start_date: new Date(String(record.start_date ?? "")),
                    end_date: new Date(String(record.end_date ?? "")),
                    premium_usd: Number(record.premium_usd),
                    status: String(record.status ?? ""),
                    insured_value_usd: Number(record.insured_value_usd),
                };
                const v = this.validator.validate(input);
                if (v.errors.length > 0) {
                    for (const e of v.errors) {
                        errors.push({ row_number: e.row_number, field: e.field, code: e.code });
                    }
                    continue;
                }
                const res = await this.policiesRepo.createOneStrict({
                    policy_number: input.policy_number,
                    customer: input.customer,
                    policy_type: input.policy_type,
                    start_date: input.start_date,
                    end_date: input.end_date,
                    premium_usd: input.premium_usd,
                    status: input.status,
                    insured_value_usd: input.insured_value_usd,
                });
                if (res === "duplicate") {
                    duplicates_count += 1;
                    errors.push({
                        row_number: input.row_number,
                        field: "policy_number",
                        code: "DUPLICATE_POLICY_NUMBER",
                    });
                    continue;
                }
                inserted_count += 1;
            }
            const rejected_count = new Set(errors.map((e) => e.row_number)).size;
            const duration_ms = Date.now() - started;
            await this.opsRepo.update(operation_id, {
                status: "COMPLETED",
                rows_inserted: inserted_count,
                rows_rejected: rejected_count,
                duration_ms,
                error_summary: rejected_count ? `${rejected_count} rejected` : null,
            });
            return {
                operation_id,
                correlation_id,
                inserted_count,
                rejected_count,
                duplicates_count,
                errors,
            };
        }
        catch (err) {
            const duration_ms = Date.now() - started;
            await this.opsRepo.update(operation_id, {
                status: "FAILED",
                duration_ms,
                error_summary: err?.message ?? "upload_failed",
            });
            throw err;
        }
    }
}
exports.UploadService = UploadService;
