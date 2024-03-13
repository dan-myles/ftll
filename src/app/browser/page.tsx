"use client"

import { z } from "zod"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { serverListSchema, ServerList } from "./data/schema"
import { Button } from "@/components/ui/button"
import { invoke } from "@tauri-apps/api/core"
import { useEffect, useState } from "react"
import { useServerListStore } from "@/stores/server-list-store"

export default function BrowserPage() {
  const servers = useServerListStore((state) => state.serverList)
  const setServerList = useServerListStore((state) => state.setServerList)

  useEffect(() => {
    const getServerList = async () => {
      const res = await invoke("get_server_list")
      const servers = serverListSchema.parse(res)
      setServerList(servers)
    }

    getServerList()
  }, [])

  return (
    <div className="h-full flex-1 flex-col space-y-4 p-4 md:flex">
      {/* Content */}
      <DataTable data={servers} columns={columns} />
    </div>
  )
}
