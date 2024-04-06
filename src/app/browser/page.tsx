"use client"

import { useServerListStore } from "@/stores/server-list-store"
import { invoke } from "@tauri-apps/api/core"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

export default function BrowserPage() {
  const servers = useServerListStore((state) => state.serverList)

  const handleClick = async () => {
    await invoke("update_server_info_semaphore", { maxUpdates: 100 })
    console.log("Updated server info")
  }

  return (
    <div className="h-full flex-1 flex-col space-y-4 bg-background p-4 md:flex">
      <DataTable data={servers} columns={columns} />
    </div>
  )
}
