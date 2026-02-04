import { render, screen, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PoliciesPage } from "./PoliciesPage"

test("loads and renders policies table", async () => {
  const qc = new QueryClient()

  render(
    <QueryClientProvider client={qc}>
      <PoliciesPage />
    </QueryClientProvider>,
  )

  expect(screen.getByText("Policies")).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.getByText("POL-001")).toBeInTheDocument()
    expect(screen.getByText("Acme Corp")).toBeInTheDocument()
  })
})
