import { UpdatedServerContext } from "@/components/stateful-table-row"
import { useFavoriteServerStore } from "@/stores/favorite-server-store"
import { Server } from "@/validators/ftla/server-schema"
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { useContext, useEffect, useState } from "react"

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
    const isFavorited = serverList.some((s: Server) => s.addr === server.addr)
    setFavorite(isFavorited)
  }, [serverList, row])

  return (
    <div className="">
      {!isFavorite && (
        <div
          onClick={handleFavorited}
          className="max-w-fit cursor-pointer rounded-md p-2 hover:bg-accent"
        >
          <HeartIcon className="h-4 w-4" />
        </div>
      )}
      {isFavorite && (
        <div
          onClick={handleFavorited}
          className="max-w-fit cursor-pointer rounded-md p-2 hover:bg-accent"
        >
          <HeartFilledIcon className="h-4 w-4 text-red-500" />
        </div>
      )}
    </div>
  )
}
