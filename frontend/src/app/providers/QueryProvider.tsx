import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 10_000,
    },
  },
})

export function QueryProvider(p: { children: React.ReactNode }) {
  return <QueryClientProvider client={client}>{p.children}</QueryClientProvider>
}
