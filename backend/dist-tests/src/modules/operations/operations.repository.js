"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationsRepository = void 0;
const prisma_1 = require("../../db/prisma");
class OperationsRepository {
    create(endpoint, correlationId) {
        return prisma_1.prisma.operation.create({
            data: {
                endpoint,
                status: "RECEIVED",
                correlation_id: correlationId,
            },
        });
    }
    update(id, data) {
        return prisma_1.prisma.operation.updateMany({
            where: { id },
            data,
        });
    }
    findById(id) {
        return prisma_1.prisma.operation.findUnique({ where: { id } });
    }
}
exports.OperationsRepository = OperationsRepository;
