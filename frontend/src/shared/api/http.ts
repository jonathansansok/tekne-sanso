export type HttpError = {
  status: number
  code?: string
  message?: string
  correlation_id?: string
}

const DEFAULT_TIMEOUT_MS = 20000

export async function http<T>(
  input: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<{ data: T; correlationId?: string }> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), init?.timeoutMs ?? DEFAULT_TIMEOUT_MS)

  const base = import.meta.env.VITE_API_URL ?? "http://localhost:3001"
  const url = input.startsWith("http") ? input : `${base}${input}`

  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        "content-type": "application/json",
        ...(init?.headers ?? {}),
      },
      signal: controller.signal,
    })

    const correlationId = res.headers.get("x-correlation-id") ?? undefined

    if (!res.ok) {
      let body: any = null
      try { body = await res.json() } catch {}
      const err: HttpError = {
        status: res.status,
        code: body?.code,
        message: body?.message ?? res.statusText,
        correlation_id: body?.correlation_id ?? correlationId,
      }
      throw err
    }

    const data = (await res.json()) as T
    return { data, correlationId }
  } finally {
    clearTimeout(timeout)
  }
}
