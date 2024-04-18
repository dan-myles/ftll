import { createFileRoute } from "@tanstack/react-router"
import { useServerListStore } from "@/stores/server-list-store"
import { columns } from "./-components/columns"
import { Table } from "./-components/table"

export const Route = createFileRoute("/server-browser/")({
  component: Index,
})

function Index() {
  const servers = useServerListStore((state) => state.serverList)

  return (
    <div className="h-full flex-1 flex-col space-y-4 bg-background p-4 md:flex">
      <Table data={servers} columns={columns} />
    </div>
  )
}
