import { Card, CardBody } from "../../shared/components/Card";

function humanizeField(field: string) {
  const map: Record<string, string> = {
    policy_number: "Policy number",
    customer: "Customer",
    policy_type: "Policy type",
    start_date: "Start date",
    end_date: "End date",
    premium_usd: "Premium (USD)",
    status: "Status",
    insured_value_usd: "Insured value (USD)",
  };
  return map[field] ?? field.replaceAll("_", " ");
}

export function UploadResult(p: {
  result: {
    operation_id: string;
    correlation_id: string;
    inserted_count: number;
    rejected_count: number;
    duplicates_count?: number;
    errors: Array<{ row_number: number; field: string; code: string }>;
  };
}) {
  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-sm">
            <div className="text-slate-500">Operation ID</div>
            <div className="mt-1 font-mono text-xs break-all rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              {p.result.operation_id}
            </div>
          </div>

          <div className="text-sm">
            <div className="text-slate-500">Correlation ID</div>
            <div className="mt-1 font-mono text-xs break-all rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              {p.result.correlation_id}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-slate-500">Inserted</span>{" "}
            <span className="font-semibold">{p.result.inserted_count}</span>
          </div>
          <div>
            <span className="text-slate-500">Rejected</span>{" "}
            <span className="font-semibold">{p.result.rejected_count}</span>
          </div>
          {typeof p.result.duplicates_count === "number" && (
            <div>
              <span className="text-slate-500">Duplicates</span>{" "}
              <span className="font-semibold">{p.result.duplicates_count}</span>
            </div>
          )}
        </div>

        {p.result.errors.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-semibold">Row errors</div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm touch-pan-x overscroll-x-contain [scrollbar-gutter:stable] [-webkit-overflow-scrolling:touch]">
              <table className="min-w-[480px] md:min-w-full text-sm">

                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-3 py-2 whitespace-nowrap">
                      Row
                    </th>
                    <th className="text-left px-3 py-2 whitespace-nowrap">
                      Field
                    </th>
                    <th className="text-left px-3 py-2 whitespace-nowrap">
                      Code
                    </th>
                  </tr>
                </thead>
                <tbody>
                 {p.result.errors.map((e, i) => (
  <tr key={i} className="border-t border-slate-200 hover:bg-slate-50/60">
    <td className="px-3 py-2 whitespace-nowrap">{e.row_number}</td>
    <td className="px-3 py-2 whitespace-nowrap">{humanizeField(e.field)}</td>
    <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">{e.code}</td>
  </tr>
))}

                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
