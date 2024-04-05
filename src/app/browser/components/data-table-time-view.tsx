import { UpdatedServerContext } from "@/components/stateful-table-row"
import { toTwelveHourTime } from "@/lib/convert-time"
import { Row } from "@tanstack/react-table"
import { useContext } from "react"
import { Server, serverSchema } from "../data/server-schema"

interface DataTableTimeViewProps<TData> {
  row: Row<TData>
}

export function DataTableTimeView<TData>({
  row,
}: DataTableTimeViewProps<TData>) {
  const server = serverSchema.parse(row.original)
  const updatedServer = useContext(UpdatedServerContext)

  function formatTime(server: Server) {
    const gameTypeSplit = server.gameType.split(",")
    const gameTime = gameTypeSplit.at(gameTypeSplit.length - 1) as string
    let formattedTime = toTwelveHourTime(gameTime) as string
    return formattedTime
  }

  return (
    <div className="flex max-w-fit flex-col space-y-1">
      {updatedServer && formatTime(updatedServer)}
      {!updatedServer && formatTime(server)}
    </div>
  )
}
