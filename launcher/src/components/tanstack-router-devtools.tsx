import { TanStackRouterDevtools as Tools } from "@tanstack/router-devtools"

export function TanStackRouterDevtools({
  open,
  position,
}: {
  open?: boolean
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}) {
  if (process.env.NODE_ENV === "production") return null
  if (!open) return null

  return <Tools position={position} />
  return null
}
