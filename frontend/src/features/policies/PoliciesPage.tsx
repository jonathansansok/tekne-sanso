import { useMemo, useState } from "react"
import { Link } from "@tanstack/react-router"
import { Page } from "../../shared/components/Page"
import { Card, CardBody } from "../../shared/components/Card"
import { Button } from "../../shared/components/Button"
import { usePolicies, useInsights } from "./hooks"

const STATUS = ["", "active", "expired", "cancelled"] as const
const TYPES = ["", "Property", "Auto"] as const

export function PoliciesPage() {
  const [status, setStatus] = useState<string>("")
  const [policyType, setPolicyType] = useState<string>("")
  const [q, setQ] = useState<string>("")
  const [limit] = useState<number>(25)
  const [offset, setOffset] = useState<number>(0)

  const params = useMemo(
    () => ({
      limit,
      offset,
      status: status || undefined,
      policy_type: policyType || undefined,
      q: q || undefined,
    }),
    [limit, offset, status, policyType, q],
  )

  const query = usePolicies(params)
  const insights = useInsights()

  const total = query.data?.pagination.total ?? 0
  const canPrev = offset > 0
  const canNext = offset + limit < total

  return (
    <Page title="Policies">
      <div className="flex gap-3 text-sm">
        <Link to="/" className="underline text-slate-700">
          Upload
        </Link>
        <Link to="/summary" className="underline text-slate-700">
          Summary
        </Link>
      </div>

      <Card>
        <CardBody className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <div className="text-xs text-slate-500">status</div>
            <select
              className="w-full h-10 rounded-xl border border-slate-200 px-3"
              value={status}
              onChange={(e) => {
                setOffset(0)
                setStatus(e.target.value)
              }}
            >
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {s || "all"}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-500">policy_type</div>
            <select
              className="w-full h-10 rounded-xl border border-slate-200 px-3"
              value={policyType}
              onChange={(e) => {
                setOffset(0)
                setPolicyType(e.target.value)
              }}
            >
              {TYPES.map((s) => (
                <option key={s} value={s}>
                  {s || "all"}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1 md:col-span-2">
            <div className="text-xs text-slate-500">search (policy_number or customer)</div>
            <input
              className="w-full h-10 rounded-xl border border-slate-200 px-3"
              value={q}
              onChange={(e) => {
                setOffset(0)
                setQ(e.target.value)
              }}
              placeholder="POL-001 / Acme..."
            />
          </div>

          <div className="md:col-span-4 flex gap-3 items-center">
            <Button
              variant="primary"
              onClick={() => insights.mutate({ filters: params })}
              loading={insights.isPending}
              disabled={query.isLoading}
            >
              Generate Insights
            </Button>

            {insights.data && (
              <div className="text-sm text-slate-600">
                risk_flags: <span className="font-semibold">{insights.data.highlights.risk_flags}</span>
              </div>
            )}
          </div>

          {insights.data && (
            <div className="md:col-span-4 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <div className="text-sm font-semibold">Insights</div>
              <ul className="list-disc pl-5 text-sm">
                {insights.data.insights.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-4">
          {query.isLoading && <div className="text-sm text-slate-600">Loading...</div>}
          {query.error && <div className="text-sm text-red-600">Failed to load</div>}

          {query.data && (
            <>
              <div className="overflow-auto border border-slate-200 rounded-xl">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-3 py-2">policy_number</th>
                      <th className="text-left px-3 py-2">customer</th>
                      <th className="text-left px-3 py-2">policy_type</th>
                      <th className="text-left px-3 py-2">premium_usd</th>
                      <th className="text-left px-3 py-2">insured_value_usd</th>
                      <th className="text-left px-3 py-2">status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {query.data.items.map((p) => (
                      <tr key={p.id} className="border-t border-slate-200">
                        <td className="px-3 py-2 font-mono text-xs">{p.policy_number}</td>
                        <td className="px-3 py-2">{p.customer}</td>
                        <td className="px-3 py-2">{p.policy_type}</td>
                        <td className="px-3 py-2">{String(p.premium_usd)}</td>
                        <td className="px-3 py-2">{String(p.insured_value_usd)}</td>
                        <td className="px-3 py-2">{p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="text-slate-600">
                  {offset + 1}-{Math.min(offset + limit, total)} / {total}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    disabled={!canPrev}
                    onClick={() => setOffset(Math.max(0, offset - limit))}
                  >
                    Prev
                  </Button>
                  <Button variant="ghost" disabled={!canNext} onClick={() => setOffset(offset + limit)}>
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </Page>
  )
}
