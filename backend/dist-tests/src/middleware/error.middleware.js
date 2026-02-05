"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const logger_1 = require("../config/logger");
function errorMiddleware(err, req, res, _next) {
    logger_1.logger.error({
        correlation_id: req.correlationId,
        endpoint: `${req.method} ${req.originalUrl}`,
        error: err?.message ?? String(err),
    });
    res.status(500).json({
        code: "INTERNAL_ERROR",
        message: "Unexpected server error",
        correlation_id: req.correlationId,
    });
}
