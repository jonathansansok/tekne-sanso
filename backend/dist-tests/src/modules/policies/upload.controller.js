"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const upload_service_1 = require("./upload.service");
const logger_1 = require("../../config/logger");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
exports.uploadMiddleware = upload.single("file");
class UploadController {
    service = new upload_service_1.UploadService();
    async uploadCsv(req, res) {
        const correlationId = req.correlationId;
        if (!req.file?.buffer) {
            return res.status(400).json({
                code: "FILE_REQUIRED",
                message: "CSV file is required as form-data field 'file'",
                correlation_id: correlationId,
            });
        }
        const result = await this.service.processCsv({
            fileStream: require("stream").Readable.from(req.file.buffer),
            correlationId,
        });
        logger_1.logger.info({
            correlation_id: correlationId,
            operation_id: result.operation_id,
            endpoint: "POST /upload",
            inserted: result.inserted_count,
            rejected: result.rejected_count,
        });
        return res.status(200).json(result);
    }
}
exports.UploadController = UploadController;
