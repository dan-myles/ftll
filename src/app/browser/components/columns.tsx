import { HeartFilledIcon } from "@radix-ui/react-icons"
import { ColumnDef } from "@tanstack/react-table"
import { HeartIcon } from "lucide-react"
import { Server } from "../data/server-schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableMapView } from "./data-table-map-view"
import { DataTableNameView } from "./data-table-name-view"
import { DataTablePingView } from "./data-table-ping-view"
import { DataTablePlayDialog } from "./data-table-play-dialog"
import { DataTableRowActions } from "./data-table-row-actions"
import { DataTableTimeView } from "./data-table-time-view"

// I should really think about changing everything to match case on api
export const columns: ColumnDef<Server>[] = [
  {
    id: "Favorited",
    header: ({ table }) => <HeartFilledIcon className="h-4 w-6" />,
    cell: ({ row }) => <HeartIcon className="h-4 w-6" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "Name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return <DataTableNameView row={row} />
    },
  },
  {
    id: "Time",
    accessorKey: "gameType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time" />
    ),
    cell: ({ row }) => {
      return <DataTableTimeView row={row} />
    },
  },
  {
    id: "Map",
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
    id: "Players",
    accessorKey: "players",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Players" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex max-w-fit items-center">
          <span>
            {row.getValue("Players")}/{row.original.maxPlayers}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "Ping",
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
    id: "Mods",
    accessorKey: "modList",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mods" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex max-w-fit items-center">
          <span>test</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return (
        row.original.modList
          ?.map((mod) => mod.name.includes(value) ?? false)
          .includes(true) ?? false
      )
    },
  },
  {
    id: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex">
          <DataTablePlayDialog row={row} />
          <DataTableRowActions row={row} />
        </div>
      )
    },
  },
]
