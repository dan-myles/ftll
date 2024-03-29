"use client"

import { useEffect, useRef, useState } from "react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { IceCreamIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { ModList, serverSchema } from "../data/schema"
import { invoke } from "@tauri-apps/api/core"
import { useServerListStore } from "@/stores/server-list-store"

interface DataTableIntervalUpdateProps<TData> {
  row: Row<TData>
}

export function DataTableIntervalUpdate<TData>({
  row,
}: DataTableIntervalUpdateProps<TData>) {
  const updateServer = useServerListStore((state) => state.updateServer)

  useEffect(() => {
    const update = async () => {
      const res = await invoke("get_server_info", {
        server: row.original,
      })
      const updatedServer = serverSchema.parse(res)
      updateServer(updatedServer)
    }

    // update()
  }, [])

  return <></>
}
