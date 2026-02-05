"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoliciesController = void 0;
const zod_1 = require("zod");
const policies_service_1 = require("./policies.service");
const ListQuery = zod_1.z.object({
    limit: zod_1.z.coerce.number().default(25).refine(v => v <= 100, "limit max is 100"),
    offset: zod_1.z.coerce.number().default(0).refine(v => v >= 0, "offset must be >= 0"),
    status: zod_1.z.string().optional(),
    policy_type: zod_1.z.string().optional(),
    q: zod_1.z.string().optional(),
});
class PoliciesController {
    service = new policies_service_1.PoliciesService();
    async list(req, res) {
        const q = ListQuery.parse(req.query);
        const { items, total } = await this.service.list({
            limit: q.limit,
            offset: q.offset,
            status: q.status,
            policy_type: q.policy_type,
            q: q.q,
        });
        return res.json({
            items,
            pagination: { limit: q.limit, offset: q.offset, total },
        });
    }
    async summary(req, res) {
        const q = ListQuery.omit({ limit: true, offset: true }).parse(req.query);
        const result = await this.service.summary({
            status: q.status,
            policy_type: q.policy_type,
            q: q.q,
        });
        return res.json(result);
    }
}
exports.PoliciesController = PoliciesController;
