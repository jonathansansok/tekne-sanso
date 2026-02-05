"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.correlationMiddleware = correlationMiddleware;
const crypto_1 = require("crypto");
function correlationMiddleware(req, res, next) {
    const incoming = req.header("x-correlation-id");
    const correlationId = incoming && incoming.trim() ? incoming.trim() : (0, crypto_1.randomUUID)();
    req.correlationId = correlationId;
    res.setHeader("x-correlation-id", correlationId);
    next();
}
