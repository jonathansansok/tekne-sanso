"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationsController = void 0;
const operations_service_1 = require("./operations.service");
class OperationsController {
    service = new operations_service_1.OperationsService();
    async getById(req, res) {
        const op = await this.service.getById(req.params.id);
        if (!op) {
            return res.status(404).json({
                code: "NOT_FOUND",
                message: "Operation not found",
                correlation_id: req.correlationId,
            });
        }
        return res.json(op);
    }
}
exports.OperationsController = OperationsController;
