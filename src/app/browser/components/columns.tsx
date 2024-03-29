"use client"

import { HeartFilledIcon } from "@radix-ui/react-icons"
import { ColumnDef } from "@tanstack/react-table"
import { HeartIcon, HeartOffIcon } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"

import { Server } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableModView } from "./data-table-mod-view"
import { DataTablePlayDialog } from "./data-table-play-dialog"
import { DataTableRowActions } from "./data-table-row-actions"
import { DataTableNameView } from "./data-table-name-view"
import { DataTableTimeView } from "./data-table-time-view"
import { DataTablePingView } from "./data-table-ping-view"
import { DataTableMapView } from "./data-table-map-view"
import { DataTableIntervalUpdate } from "./data-table-interval-update"

// i should really think about changing everything to match case on api
export const columns: ColumnDef<Server>[] = [
  {
    id: "favorited",
    header: ({ table }) => <HeartFilledIcon className="h-4 w-6" />,
    cell: ({ row }) => <HeartIcon className="h-4 w-6" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return <DataTableNameView row={row} />
    },
  },
  {
    accessorKey: "Time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time" />
    ),
    cell: ({ row }) => {
      return <DataTableTimeView row={row} />
    },
  },
  {
    accessorKey: "map",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Map" />
    ),
    cell: ({ row }) => {
      return <DataTableMapView row={row} />
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "players",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Players" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex max-w-fit items-center">
          <span>
            {row.getValue("players")}/{row.original.max_players}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "ping",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ping" />
    ),
    cell: ({ row }) => {
      return <DataTablePingView row={row} />
    },
    filterFn: (row, id, value) => {
      // TODO: fix the any type
      return (row.getValue(id) as any) <= value
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex">
          <DataTablePlayDialog row={row} />
          <DataTableRowActions row={row} />
        </div>
      )
    },
  },
  {
    id: "intervalUpdate",
    cell: ({ row }) => {
      return <DataTableIntervalUpdate row={row} />
    },
  },
]
