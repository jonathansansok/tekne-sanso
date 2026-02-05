"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.policiesRoutes = policiesRoutes;
const express_1 = require("express");
const policies_controller_1 = require("./policies.controller");
const asyncHandler_1 = require("../../utils/asyncHandler");
function policiesRoutes() {
    const r = (0, express_1.Router)();
    const c = new policies_controller_1.PoliciesController();
    r.get("/policies", (0, asyncHandler_1.asyncHandler)(c.list.bind(c)));
    r.get("/policies/summary", (0, asyncHandler_1.asyncHandler)(c.summary.bind(c)));
    return r;
}
