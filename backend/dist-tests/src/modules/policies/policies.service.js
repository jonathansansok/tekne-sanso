"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoliciesService = void 0;
const policies_repository_1 = require("./policies.repository");
class PoliciesService {
    repo = new policies_repository_1.PoliciesRepository();
    list(params) {
        return this.repo.list(params);
    }
    summary(params) {
        return this.repo.summary(params);
    }
}
exports.PoliciesService = PoliciesService;
