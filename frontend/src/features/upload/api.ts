import { http } from "../../shared/api/http"
import { UploadResponseSchema } from "../../shared/api/schemas"

export async function uploadCsv(file: File) {
  const base = import.meta.env.VITE_API_URL ?? "http://localhost:3001"
  const url = `${base}/upload`

  const fd = new FormData()
  fd.append("file", file)

  const res = await fetch(url, { method: "POST", body: fd })
  const correlationId = res.headers.get("x-correlation-id") ?? undefined

  if (!res.ok) {
    let body: any = null
    try { body = await res.json() } catch {}
    throw { status: res.status, code: body?.code, message: body?.message, correlation_id: body?.correlation_id ?? correlationId }
  }

  const data = await res.json()
  return UploadResponseSchema.parse(data)
}
