import { Card, CardBody } from "../../shared/components/Card"

export function UploadResult(p: {
  result: {
    operation_id: string
    correlation_id: string
    inserted_count: number
    rejected_count: number
    duplicates_count?: number
    errors: Array<{ row_number: number; field: string; code: string }>
  }
}) {

  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-sm">
            <div className="text-slate-500">operation_id</div>
            <div className="font-mono text-xs break-all">{p.result.operation_id}</div>
          </div>
          <div className="text-sm">
            <div className="text-slate-500">correlation_id</div>
            <div className="font-mono text-xs break-all">{p.result.correlation_id}</div>
          </div>
        </div>

       <div className="flex flex-wrap gap-4 text-sm">
  <div>
    <span className="text-slate-500">inserted</span>{" "}
    <span className="font-semibold">{p.result.inserted_count}</span>
  </div>
  <div>
    <span className="text-slate-500">rejected</span>{" "}
    <span className="font-semibold">{p.result.rejected_count}</span>
  </div>
  {"duplicates_count" in p.result && (
    <div>
      <span className="text-slate-500">duplicates</span>{" "}
      <span className="font-semibold">{p.result.duplicates_count ?? 0}</span>
    </div>
  )}
</div>


        {p.result.errors.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-semibold">Errors</div>
            <div className="overflow-auto border border-slate-200 rounded-xl">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-3 py-2">row</th>
                    <th className="text-left px-3 py-2">field</th>
                    <th className="text-left px-3 py-2">code</th>
                  </tr>
                </thead>
                <tbody>
                  {p.result.errors.map((e, i) => (
                    <tr key={i} className="border-t border-slate-200">
                      <td className="px-3 py-2">{e.row_number}</td>
                      <td className="px-3 py-2">{e.field}</td>
                      <td className="px-3 py-2 font-mono text-xs">{e.code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
