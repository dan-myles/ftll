import { Badge } from "@/components/ui/badge"
import { Row } from "@tanstack/react-table"
import { IceCreamIcon } from "lucide-react"
import { serverSchema } from "../data/server-schema"

interface DataTableModViewProps<TData> {
  row: Row<TData>
}

export function DataTableModView<TData>({ row }: DataTableModViewProps<TData>) {
  const server = serverSchema.parse(row.original)
  const rows = []

  if (!server.mod_list) {
    return (
      <Badge className="mr-1">
        <IceCreamIcon className="h-4 w-4" />
      </Badge>
    )
  }

  // only show the first 3 mods
  if (server.mod_list.length >= 3) {
    for (let i = 0; i < 2; i++) {
      rows.push(
        <Badge
          key={server.mod_list[i].workshop_id}
          className="mr-1 min-w-fit max-w-fit sm:mt-1"
        >
          {server.mod_list[i].name}
        </Badge>
      )
    }
  } else {
    for (let i = 0; i < server.mod_list.length; i++) {
      rows.push(
        <div>
          <Badge
            key={server.mod_list[i].workshop_id}
            className="mr-1 min-w-fit"
          >
            {server.mod_list[i].name}
          </Badge>
        </div>
      )
    }
  }

  return (
    <div className="flex min-w-[200px] overflow-hidden sm:flex-col lg:flex-row">
      {rows}
      {server.mod_list.length >= 4 && (
        <button className="text-xs text-gray-500 sm:mt-1">
          <Badge className="sm:float-left">+{server.mod_list.length - 2}</Badge>
        </button>
      )}
    </div>
  )
}
