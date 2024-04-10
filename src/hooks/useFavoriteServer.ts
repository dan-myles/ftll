import { useFavoriteServerStore } from "@/stores/favorite-server-store"
import { Server } from "@/validators/ftla/server-schema"
import { useEffect, useState } from "react"

export function useFavoriteServer(s: Server) {
  const { addServer, removeServer, serverList } = useFavoriteServerStore()
  const [isFavorite, setFavorite] = useState(false)

  // Handle the favorited server
  const handleFavorited = () => {
    if (isFavorite) {
      setFavorite(false)
      removeServer(s)
    } else {
      setFavorite(true)
      addServer(s)
    }
  }

  // Check if the server is favorited
  useEffect(() => {
    const isFavorited = serverList.some((server) => server.addr === s.addr)
    setFavorite(isFavorited)
  }, [serverList, s])

  return { isFavorite, handleFavorited }
}
