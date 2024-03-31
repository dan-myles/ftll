import { Row } from "@tanstack/react-table"
import { serverSchema } from "../data/server-schema"

interface DataTableTimeViewProps<TData> {
  row: Row<TData>
}

export function DataTableTimeView<TData>({
  row,
}: DataTableTimeViewProps<TData>) {
  const server = serverSchema.parse(row.original)
  const gametypeSplit = server.gametype.split(",")

  return (
    <div className="flex max-w-fit flex-col space-y-1">
      {gametypeSplit.at(gametypeSplit.length - 1)}
    </div>
  )
}
