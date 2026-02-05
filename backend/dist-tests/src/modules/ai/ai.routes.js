"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRoutes = aiRoutes;
const express_1 = require("express");
const ai_controller_1 = require("./ai.controller");
const asyncHandler_1 = require("../../utils/asyncHandler");
function aiRoutes() {
    const r = (0, express_1.Router)();
    const c = new ai_controller_1.AiController();
    r.post("/ai/insights", (0, asyncHandler_1.asyncHandler)(c.insights.bind(c)));
    return r;
}
