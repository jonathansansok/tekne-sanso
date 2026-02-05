"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLoggerMiddleware = requestLoggerMiddleware;
const logger_1 = require("../config/logger");
function requestLoggerMiddleware(req, res, next) {
    const start = Date.now();
    res.on("finish", () => {
        const duration_ms = Date.now() - start;
        logger_1.logger.info({
            correlation_id: req.correlationId,
            endpoint: `${req.method} ${req.originalUrl}`,
            statusCode: res.statusCode,
            duration_ms,
        });
    });
    next();
}
