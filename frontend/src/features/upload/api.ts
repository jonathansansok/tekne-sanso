import { UploadResponseSchema } from "../../shared/api/schemas"

type UploadApiError = {
  status: number
  code?: string
  message?: string
  correlation_id?: string
}

export async function uploadCsv(file: File) {
 const base = import.meta.env.VITE_API_URL ?? "http://localhost:3001"
  const url = `${base}/upload`

  const fd = new FormData()
  fd.append("file", file)

  const res = await fetch(url, { method: "POST", body: fd })
  const correlationId = res.headers.get("x-correlation-id") ?? undefined

  if (!res.ok) {
    let body: unknown = null

    try {
      body = await res.json()
    } catch {
      body = null
    }

    const b = body as { code?: string; message?: string; correlation_id?: string } | null

    const err: UploadApiError = {
      status: res.status,
      code: b?.code,
      message: b?.message ?? res.statusText,
      correlation_id: b?.correlation_id ?? correlationId,
    }
    throw err
  }

  const data: unknown = await res.json()
  return UploadResponseSchema.parse(data)
}
