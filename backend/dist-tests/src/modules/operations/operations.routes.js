"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationsRoutes = operationsRoutes;
const express_1 = require("express");
const operations_controller_1 = require("./operations.controller");
const asyncHandler_1 = require("../../utils/asyncHandler");
function operationsRoutes() {
    const r = (0, express_1.Router)();
    const c = new operations_controller_1.OperationsController();
    r.get("/operations/:id", (0, asyncHandler_1.asyncHandler)(c.getById.bind(c)));
    return r;
}
