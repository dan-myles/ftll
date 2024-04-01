import { toTwelveHourTime } from "@/lib/convert-time"
import { Row } from "@tanstack/react-table"
import { serverSchema } from "../data/server-schema"

interface DataTableTimeViewProps<TData> {
  row: Row<TData>
}

export function DataTableTimeView<TData>({
  row,
}: DataTableTimeViewProps<TData>) {
  const server = serverSchema.parse(row.original)
  const gameTypeSplit = server.gameType.split(",")
  const gameTime = gameTypeSplit.at(gameTypeSplit.length - 1) as string
  let formattedTime = toTwelveHourTime(gameTime, "hh:MM A") as string

  return (
    <div className="flex max-w-fit flex-col space-y-1">{formattedTime}</div>
  )
}
