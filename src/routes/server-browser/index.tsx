import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/server-browser/")({
  component: Index,
})

function Index() {
  return <div>test</div>
}

