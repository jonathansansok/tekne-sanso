import { OperationsRepository } from "./operations.repository";

export class OperationsService {
  private readonly repo = new OperationsRepository();

  getById(id: string) {
    return this.repo.findById(id);
  }
}
