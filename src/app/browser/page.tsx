"use client"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { useServerListStore } from "@/stores/server-list-store"

export default function BrowserPage() {
  const servers = useServerListStore((state) => state.serverList)

  return (
    <div className="h-full flex-1 flex-col space-y-4 p-4 md:flex">
      <DataTable data={servers} columns={columns} />
    </div>
  )
}
