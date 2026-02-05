import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PoliciesPage } from "./PoliciesPage"
import { vi } from "vitest"

type LinkProps = {
  to: string | { to?: string }
  children?: React.ReactNode
  [key: string]: unknown
}

type RouterModule = Record<string, unknown>

vi.mock("@tanstack/react-router", async () => {
  const actual = (await vi.importActual("@tanstack/react-router")) as RouterModule

  return {
    ...actual,
    Link: (p: LinkProps) => {
      const { to, children, ...rest } = p
      const href = typeof to === "string" ? to : (to?.to ?? "/")
      return (
        <a href={href} {...rest}>
          {children}
        </a>
      )
    },
  }
})

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
