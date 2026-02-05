"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./swagger");
const correlation_middleware_1 = require("./middleware/correlation.middleware");
const request_logger_middleware_1 = require("./middleware/request-logger.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const upload_routes_1 = require("./modules/policies/upload.routes");
const policies_routes_1 = require("./modules/policies/policies.routes");
const ai_routes_1 = require("./modules/ai/ai.routes");
const operations_routes_1 = require("./modules/operations/operations.routes");
function buildApp() {
    const app = (0, express_1.default)();
    app.get("/health", (_req, res) => {
        return res.status(200).json({ ok: true });
    });
    app.use((0, cors_1.default)({ origin: true }));
    app.use(express_1.default.json({ limit: "2mb" }));
    app.use(correlation_middleware_1.correlationMiddleware);
    app.use(request_logger_middleware_1.requestLoggerMiddleware);
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
    app.use((0, operations_routes_1.operationsRoutes)());
    app.use((0, upload_routes_1.uploadRoutes)());
    app.use((0, policies_routes_1.policiesRoutes)());
    app.use((0, ai_routes_1.aiRoutes)());
    app.use(error_middleware_1.errorMiddleware);
    return app;
}
