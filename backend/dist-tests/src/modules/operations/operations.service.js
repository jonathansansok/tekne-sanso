"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationsService = void 0;
const operations_repository_1 = require("./operations.repository");
class OperationsService {
    repo = new operations_repository_1.OperationsRepository();
    getById(id) {
        return this.repo.findById(id);
    }
}
exports.OperationsService = OperationsService;
