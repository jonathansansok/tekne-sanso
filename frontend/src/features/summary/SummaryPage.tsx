import { Link } from "@tanstack/react-router";
import { Page } from "../../shared/components/Page";
import { Card, CardBody } from "../../shared/components/Card";
import { useSummary } from "./hooks";

function titleCase(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function SummaryPage() {
  const q = useSummary();

  return (
    <Page title="Summary">
      <div className="flex flex-wrap gap-3 text-sm">
        <Link to="/" className="underline text-slate-700">
          Upload
        </Link>
        <Link to="/policies" className="underline text-slate-700">
          Policies
        </Link>
      </div>

      <Card>
        <CardBody className="space-y-4">
          {q.isLoading && (
            <div className="text-sm text-slate-600">Loading...</div>
          )}
          {q.error && (
            <div className="text-sm text-red-600">Failed to load</div>
          )}

          {q.data && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs text-slate-500">Total policies</div>
                  <div className="text-xl font-semibold">
                    {q.data.total_policies}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs text-slate-500">
                    Total premium (USD)
                  </div>
                  <div className="text-xl font-semibold">
                    {String(q.data.total_premium_usd)}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                <div className="text-sm font-semibold">Count by status</div>
                <ul className="text-sm list-disc pl-4 md:pl-5">
                  {Object.entries(q.data.count_by_status).map(([k, v]) => (
                    <li key={k}>
                      {titleCase(k)}: {v}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                <div className="text-sm font-semibold">
                  Premium by policy type (USD)
                </div>
                <ul className="text-sm list-disc pl-4 md:pl-5">
                  {Object.entries(q.data.premium_by_type).map(([k, v]) => (
                    <li key={k}>
                      {k}: {String(v)}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </Page>
  );
}
