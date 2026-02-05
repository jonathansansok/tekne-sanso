import { useMutation } from "@tanstack/react-query"
import { uploadCsv } from "./api"

export type UploadApiError = {
  status: number
  code?: string
  message?: string
  correlation_id?: string
}

export function useUploadCsv() {
  return useMutation<
    Awaited<ReturnType<typeof uploadCsv>>,
    UploadApiError,
    File
  >({
    mutationFn: (file) => uploadCsv(file),
  })
}
