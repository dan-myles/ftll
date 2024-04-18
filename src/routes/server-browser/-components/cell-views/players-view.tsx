import { useContext } from "react"
import { type Row } from "@tanstack/react-table"
import { serverSchema } from "@/schemas/ftla/server-schema"
import { UpdatedServerContext } from "../row"

interface PlayersViewProps<TData> {
  row: Row<TData>
}

export function PlayersView<TData>({ row }: PlayersViewProps<TData>) {
  const updatedServer = useContext(UpdatedServerContext)
  const server = serverSchema.parse(row.original)

  return (
    <div className="">
      {updatedServer &&
        updatedServer.ping === 99999 &&
        "0" + "/" + server.maxPlayers}

      {updatedServer &&
        updatedServer.ping !== 99999 &&
        updatedServer.players + "/" + updatedServer.maxPlayers}

      {!updatedServer && server.ping === 99999 && "0" + "/" + server.maxPlayers}

      {!updatedServer &&
        server.ping !== 99999 &&
        server.players + "/" + server.maxPlayers}
    </div>
  )
}
