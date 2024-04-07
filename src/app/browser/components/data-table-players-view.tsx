import { UpdatedServerContext } from "@/components/stateful-table-row"
import { serverSchema } from "@/validators/ftla/server-schema"
import { Row } from "@tanstack/react-table"
import { useContext } from "react"

interface DataTablePlayersViewProps<TData> {
  row: Row<TData>
}

export function DataTablePlayersView<TData>({
  row,
}: DataTablePlayersViewProps<TData>) {
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
