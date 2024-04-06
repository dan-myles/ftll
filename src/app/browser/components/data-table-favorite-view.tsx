import { UpdatedServerContext } from "@/components/stateful-table-row"
import { Button } from "@/components/ui/button"
import { useFavoriteServerStore } from "@/stores/favorite-server-store"
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { useContext, useEffect, useState } from "react"
import { Server } from "../data/server-schema"

interface DataTableFavoriteView<TData> {
  row: Row<TData>
}

export function DataTableFavoriteView<TData>({
  row,
}: DataTableFavoriteView<TData>) {
  const { updateServer, addServer, removeServer, serverList } =
    useFavoriteServerStore()
  const [isFavorite, setFavorite] = useState(false)
  const updatedServer = useContext(UpdatedServerContext)

  const handleFavorited = () => {
    const server = row.original as Server
    if (isFavorite) {
      setFavorite(false)
      removeServer(server)
    } else {
      setFavorite(true)
      addServer(server)
    }
  }

  useEffect(() => {
    const update = () => {
      if (updatedServer === undefined) {
        return
      }
      updateServer(updatedServer)
    }

    update()
  }, [updatedServer, updateServer])

  useEffect(() => {
    const server = row.original as Server
    const isFavorited = serverList.some((s) => s.addr === server.addr)
    setFavorite(isFavorited)
  }, [serverList, row])

  return (
    <div className="max-w-4">
      {!isFavorite && (
        <Button variant="ghost" onClick={handleFavorited}>
          <HeartIcon className="h-4 w-4" />
        </Button>
      )}
      {isFavorite && (
        <Button variant="ghost" onClick={handleFavorited}>
          <HeartFilledIcon className="h-4 w-4 text-red-500" />
        </Button>
      )}
      <Button onClick={() => console.log(serverList)}>log</Button>
    </div>
  )
}
