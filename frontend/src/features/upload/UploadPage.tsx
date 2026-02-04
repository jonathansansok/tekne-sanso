import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Page } from "../../shared/components/Page"
import { Card, CardBody } from "../../shared/components/Card"
import { Button } from "../../shared/components/Button"
import { useUploadCsv } from "./hooks"
import { UploadResult } from "./UploadResult"

export function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const m = useUploadCsv()

  return (
    <Page title="Upload CSV">
      <div className="flex gap-3 text-sm">
        <Link to="/policies" className="underline text-slate-700">Policies</Link>
        <Link to="/summary" className="underline text-slate-700">Summary</Link>
      </div>

      <Card>
        <CardBody className="space-y-4">
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          <div className="flex items-center gap-3">
            <Button
              onClick={() => file && m.mutate(file)}
              disabled={!file}
              loading={m.isPending}
            >
              Upload
            </Button>

            {m.error && (
              <div className="text-sm text-red-600">
                {(m.error as any)?.code ?? "ERROR"} {(m.error as any)?.message ?? ""}
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {m.data && <UploadResult result={m.data} />}
    </Page>
  )
}
