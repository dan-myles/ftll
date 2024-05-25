import { useContext } from "react"
import { type Row } from "@tanstack/react-table"
import { type Server32 } from "@/tauri-bindings"
import { UpdatedServerContext } from "../row"

interface PlayersViewProps<TData> {
  row: Row<TData>
}

export function PlayersView<TData>({ row }: PlayersViewProps<TData>) {
  const updatedServer = useContext(UpdatedServerContext)
  const server = row.original as Server32

  return (
    <div className="">
      {updatedServer &&
        updatedServer.ping === 99999 &&
        "0" + "/" + server.max_players}

      {updatedServer &&
        updatedServer.ping !== 99999 &&
        updatedServer.players + "/" + updatedServer.max_players}

      {!updatedServer &&
        server.ping === 99999 &&
        "0" + "/" + server.max_players}

      {!updatedServer &&
        server.ping !== 99999 &&
        server.players + "/" + server.max_players}
    </div>
  )
}
