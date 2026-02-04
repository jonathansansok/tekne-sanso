import { http, HttpResponse } from "msw"

export const handlers = [
  http.get("http://localhost:3001/policies", ({ request }) => {
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get("limit") ?? 25)
    const offset = Number(url.searchParams.get("offset") ?? 0)

    return HttpResponse.json({
      items: [
        {
          id: "1",
          policy_number: "POL-001",
          customer: "Acme Corp",
          policy_type: "Property",
          start_date: "2025-01-01T00:00:00.000Z",
          end_date: "2025-12-31T00:00:00.000Z",
          premium_usd: "1200",
          status: "active",
          insured_value_usd: "6000",
          created_at: "2026-02-04T00:00:00.000Z",
        },
      ],
      pagination: { limit, offset, total: 1 },
    })
  }),

  http.post("http://localhost:3001/ai/insights", async () => {
    return HttpResponse.json({
      insights: ["Mock insight 1", "Mock insight 2"],
      highlights: { total_policies: 1, risk_flags: 1 },
    })
  }),
]
