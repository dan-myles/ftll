import { createFileRoute } from "@tanstack/react-router"
import { useServerListStore } from "@/stores/server-list-store"
import { columns } from "./-components/columns"
import { Table as ServerBrowser } from "./-components/table"

export const Route = createFileRoute("/server-browser/")({
  component: Index,
})

function Index() {
  const servers = useServerListStore((state) => state.serverList)

  return (
    <div
      className="h-full flex-1 flex-grow flex-col space-y-4 bg-background p-4
        pt-2 md:flex"
    >
      <ServerBrowser data={servers} columns={columns} />
    </div>
  )
}
