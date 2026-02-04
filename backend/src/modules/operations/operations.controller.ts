import type { Request, Response } from "express";
import { OperationsService } from "./operations.service";

export class OperationsController {
  private readonly service = new OperationsService();

  async getById(req: Request, res: Response) {
    const op = await this.service.getById(req.params.id);

    if (!op) {
      return res.status(404).json({
        code: "NOT_FOUND",
        message: "Operation not found",
        correlation_id: req.correlationId,
      });
    }

    return res.json(op);
  }
}
