"use client"

import { useEffect, useRef, useState } from "react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { IceCreamIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { ModList, serverSchema } from "../data/schema"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableModView<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const server = serverSchema.parse(row.original)
  const rows = []

  if (!server.ModList) {
    return (
      <Badge className="mr-1">
        <IceCreamIcon className="h-4 w-4" />
      </Badge>
    )
  }

  // only show the first 3 mods
  if (server.ModList.length >= 3) {
    for (let i = 0; i < 2; i++) {
      rows.push(
        <Badge
          key={server.ModList[i].WorkshopId}
          className="mr-1 min-w-fit max-w-fit sm:mt-1"
        >
          {server.ModList[i].Name}
        </Badge>
      )
    }
  } else {
    for (let i = 0; i < server.ModList.length; i++) {
      rows.push(
        <div>
          <Badge key={server.ModList[i].WorkshopId} className="mr-1 min-w-fit">
            {server.ModList[i].Name}
          </Badge>
        </div>
      )
    }
  }

  return (
    <div className="inline-block flex min-w-[200px] overflow-hidden sm:flex-col lg:flex-row">
      {rows}
      {server.ModList.length >= 4 && (
        <button className="text-xs text-gray-500 sm:mt-1">
          <Badge className="sm:float-left">+{server.ModList.length - 2}</Badge>
        </button>
      )}
    </div>
  )
}
