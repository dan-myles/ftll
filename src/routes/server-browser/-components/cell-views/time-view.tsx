import { useContext } from "react"
import { type Row } from "@tanstack/react-table"
import { toTwelveHourTime } from "@/lib/convert-time"
import { type Server, serverSchema } from "@/schemas/server-schema"
import { UpdatedServerContext } from "../row"

interface TimeViewProps<TData> {
  row: Row<TData>
}

export function TimeView<TData>({ row }: TimeViewProps<TData>) {
  const server = serverSchema.parse(row.original)
  const updatedServer = useContext(UpdatedServerContext)

  function formatTime(server: Server) {
    const gameTypeSplit = server.gameType.split(",")
    const gameTime = gameTypeSplit.at(gameTypeSplit.length - 1)!
    // eslint-disable-next-line
    const formattedTime = toTwelveHourTime(gameTime) as string
    return formattedTime
  }

  return (
    <div className="flex max-w-fit flex-col space-y-1">
      {updatedServer && formatTime(updatedServer)}
      {!updatedServer && formatTime(server)}
    </div>
  )
}
