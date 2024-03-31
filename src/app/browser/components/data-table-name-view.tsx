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

  // Theres gotta be a better way to do this 💀
  if (!server.mod_list) {
    return (
      <div className="flex flex-col">
        <div className="truncate font-medium md:max-w-[400px] lg:max-w-[600px] xl:max-w-[850px]">
          {server.name}
        </div>
      </div>
    )
  }

  if (server.mod_list.at(0)?.workshop_id === 0) {
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
        {server.mod_list.map((mod) => {
          return (
            <span key={mod.workshop_id} className="text-gray-500">
              {mod.name} |{" "}
            </span>
          )
        })}
      </div>
    </div>
  )
}
