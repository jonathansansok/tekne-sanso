import { createRouter, createRoute, createRootRoute, Outlet } from "@tanstack/react-router"
import { UploadPage } from "../features/upload/UploadPage"
import { PoliciesPage } from "../features/policies/PoliciesPage"
import { SummaryPage } from "../features/summary/SummaryPage"

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: UploadPage,
})

const policiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/policies",
  component: PoliciesPage,
})

const summaryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/summary",
  component: SummaryPage,
})

const routeTree = rootRoute.addChildren([uploadRoute, policiesRoute, summaryRoute])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
