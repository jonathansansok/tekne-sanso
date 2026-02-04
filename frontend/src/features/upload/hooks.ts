import { useMutation } from "@tanstack/react-query"
import { uploadCsv } from "./api"

export function useUploadCsv() {
  return useMutation({
    mutationFn: (file: File) => uploadCsv(file),
  })
}
