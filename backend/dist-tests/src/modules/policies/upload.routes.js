"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoutes = uploadRoutes;
const express_1 = require("express");
const upload_controller_1 = require("./upload.controller");
const asyncHandler_1 = require("../../utils/asyncHandler");
function uploadRoutes() {
    const r = (0, express_1.Router)();
    const c = new upload_controller_1.UploadController();
    r.post("/upload", upload_controller_1.uploadMiddleware, (0, asyncHandler_1.asyncHandler)(c.uploadCsv.bind(c)));
    return r;
}
