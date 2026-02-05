"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const zod_1 = require("zod");
const ai_service_1 = require("./ai.service");
const BodySchema = zod_1.z.object({
    filters: zod_1.z.object({
        status: zod_1.z.string().optional(),
        policy_type: zod_1.z.string().optional(),
        q: zod_1.z.string().optional(),
    }).optional(),
});
class AiController {
    service = new ai_service_1.AiService();
    async insights(req, res) {
        const body = BodySchema.parse(req.body);
        const result = await this.service.insights(body);
        return res.json(result);
    }
}
exports.AiController = AiController;
