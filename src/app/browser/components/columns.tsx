import { Server } from "@/validators/ftla/server-schema"
import { HeartFilledIcon } from "@radix-ui/react-icons"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableFavoriteView } from "./data-table-favorite-view"
import { DataTableMapView } from "./data-table-map-view"
import { DataTableNameView } from "./data-table-name-view"
import { DataTablePingView } from "./data-table-ping-view"
import { DataTablePlayDialog } from "./data-table-play-dialog"
import { DataTablePlayersView } from "./data-table-players-view"
import { DataTableRowActions } from "./data-table-row-actions"
import { DataTableTimeView } from "./data-table-time-view"

// I should really think about changing everything to match case on api
export const columns: ColumnDef<Server>[] = [
  {
    id: "Favorited",
    header: () => <HeartFilledIcon className="ml-4 h-4 w-4" />,
    cell: ({ row }) => <DataTableFavoriteView row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "Name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <DataTableNameView row={row} />,
  },
  {
    id: "Time",
    accessorKey: "gameType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time" />
    ),
    cell: ({ row }) => <DataTableTimeView row={row} />,
  },
  {
    id: "Map",
    accessorKey: "map",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Map" />
    ),
    cell: ({ row }) => <DataTableMapView row={row} />,
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
    cell: ({ row }) => <DataTablePlayersView row={row} />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "Ping",
    accessorKey: "ping",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ping" />
    ),
    cell: ({ row }) => <DataTablePingView row={row} />,
    filterFn: (row, id, value) => {
      // TODO: fix the any type
      return (row.getValue(id) as any) <= value
    },
  },
  {
    id: "Mods",
    accessorKey: "modList",
    filterFn: (row, _id, value) => {
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
