import { HeartFilledIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
import { type Server32 } from "@/tauri-bindings"
import { FavoriteView } from "./cell-views/favorite-view"
import { MapView } from "./cell-views/map-view"
import { NameView } from "./cell-views/name-view"
import { PingView } from "./cell-views/ping-view"
import { PlayDialogView } from "./cell-views/play-dialog-view"
import { PlayersView } from "./cell-views/players-view"
import { RowActionsView } from "./cell-views/row-actions-view"
import { TimeView } from "./cell-views/time-view"
import { ColumnHeader } from "./column-header"

// I should really think about changing everything to match case on api
export const columns: ColumnDef<Server32>[] = [
  {
    id: "Favorited",
    header: () => <HeartFilledIcon className="ml-2 h-4 w-4" />,
    cell: ({ row }) => <FavoriteView row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "Name",
    accessorKey: "name",
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <NameView row={row} />,
  },
  {
    id: "Time",
    accessorKey: "gameType",
    header: ({ column }) => <ColumnHeader column={column} title="Time" />,
    cell: ({ row }) => <TimeView row={row} />,
  },
  {
    id: "Map",
    accessorKey: "map",
    header: ({ column }) => <ColumnHeader column={column} title="Map" />,
    cell: ({ row }) => <MapView row={row} />,
    filterFn: (row, id, value) => {
      // eslint-disable-next-line
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "Players",
    accessorKey: "players",
    header: ({ column }) => <ColumnHeader column={column} title="Players" />,
    cell: ({ row }) => <PlayersView row={row} />,
    // eslint-disable-next-line
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "Ping",
    accessorKey: "ping",
    header: ({ column }) => <ColumnHeader column={column} title="Ping" />,
    cell: ({ row }) => <PingView row={row} />,
    filterFn: (row, id, value) => {
      // TODO:
      // @ts-expect-error - Get types for tanstack rows
      return row.getValue(id) <= value
    },
  },
  {
    id: "Mods",
    accessorKey: "modList",
    filterFn: (row, _id, value) => {
      return (
        row.original.mod_list
          // eslint-disable-next-line
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
          <PlayDialogView row={row} />
          <RowActionsView row={row} />
        </div>
      )
    },
  },
]
