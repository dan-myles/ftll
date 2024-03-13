"use client"
import { Row } from "@tanstack/react-table"
import { serverSchema } from "../data/schema"
import { MinusIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableNameView<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const server = serverSchema.parse(row.original)

  if (!server.ModList) {
    return (
      <div className="flex flex-col">
        <div className="truncate font-medium md:max-w-[400px] lg:max-w-[600px] xl:max-w-[850px]">
          {server.name}
        </div>
      </div>
    )
  }

  return (
    <div className="flex max-w-[400px] flex-col">
      <div className="truncate font-medium md:max-w-[400px] lg:max-w-[600px] xl:max-w-[850px]">
        {server.name}
      </div>
      <div className="truncate text-gray-500">
        {server.ModList.map((mod) => {
          return (
            <span key={mod.WorkshopId} className="text-gray-500">
              {mod.Name} |{" "}
            </span>
          )
        })}
      </div>
    </div>
  )
}
