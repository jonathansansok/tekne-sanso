import { PoliciesRepository } from "./policies.repository"

export class PoliciesService {
  private readonly repo = new PoliciesRepository()

  list(params: {
    limit: number
    offset: number
    status?: string
    policy_type?: string
    q?: string
  }) {
    return this.repo.list(params)
  }

  summary(params: { status?: string; policy_type?: string; q?: string }) {
    return this.repo.summary(params)
  }
}
