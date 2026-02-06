import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Page } from "../../shared/components/Page"
import { Card, CardBody } from "../../shared/components/Card"
import { Button } from "../../shared/components/Button"
import { useUploadCsv } from "./hooks"
import { UploadResult } from "./UploadResult"

type UploadApiError = {
  status: number
  code?: string
  message?: string
  correlation_id?: string
}

function isUploadApiError(x: unknown): x is UploadApiError {
  if (!x || typeof x !== "object") return false
  const o = x as Record<string, unknown>
  return typeof o.status === "number"
}

export function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const m = useUploadCsv()

  const err = m.error
  const showErr = err ? (isUploadApiError(err) ? err : null) : null

  return (
    <Page title="Upload CSV">
      <div className="flex gap-3 text-sm">
        <Link to="/policies" className="underline text-slate-700">
          Policies
        </Link>
        <Link to="/summary" className="underline text-slate-700">
          Summary
        </Link>
      </div>

      <Card>
        <CardBody className="space-y-4">
          <label className="block">
  <div className="text-xs text-slate-500 mb-2">CSV file</div>
  <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 h-10 shadow-sm">
    <input
      className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
      type="file"
      accept=".csv,text/csv"
      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
    />
  </div>
</label>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => file && m.mutate(file)}
              disabled={!file}
              loading={m.isPending}
            >
              Upload
            </Button>

            {err && (
              <div className="text-sm text-red-600">
                {showErr ? (
                  <>
                    <div>
                      {showErr.code ?? "ERROR"} {showErr.message ?? ""}
                    </div>
                    <div className="font-mono text-xs opacity-80">
                      corr: {showErr.correlation_id ?? "n/a"}
                    </div>
                  </>
                ) : (
                  <div>Upload failed</div>
                )}
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {m.data && <UploadResult result={m.data} />}
    </Page>
  )
}
