import { useContext } from "react"
import { type Row } from "@tanstack/react-table"
import { toTwelveHourTime } from "@/lib/convert-time"
import { type Server32 } from "@/tauri-bindings"
import { UpdatedServerContext } from "../row"

interface TimeViewProps<TData> {
  row: Row<TData>
}

export function TimeView<TData>({ row }: TimeViewProps<TData>) {
  const server = row.original as Server32
  const updatedServer = useContext(UpdatedServerContext)

  function formatTime(server: Server32) {
    const gameTypeSplit = server.game_type.split(",")
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
