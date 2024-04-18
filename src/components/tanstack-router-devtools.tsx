import { TanStackRouterDevtools as Tools } from "@tanstack/router-devtools"

export function TanStackRouterDevtools() {
  if (process.env.NODE_ENV === "production") return null

  return <Tools position="top-left" />
}
