import { useEffect, useState } from "react"
import { type Server } from "@/schemas/ftla/server-schema"
import { useFavoriteServerStore } from "@/stores/favorite-server-store"

export function useFavoriteServer(s: Server) {
  const [isFavorite, setFavorite] = useState(false)
  const { addServer, removeServer, serverList } = useFavoriteServerStore()

  // Handle the favorited server
  // Meant to be called from an onClick event
  const handleFavorited = () => {
    if (isFavorite) {
      setFavorite(false)
      removeServer(s)
    } else {
      setFavorite(true)
      addServer(s)
    }
  }

  // Check if the server is favorited before rendering
  useEffect(() => {
    const isFavorited = serverList.some((server) => server.addr === s.addr)
    setFavorite(isFavorited)
  }, [serverList, s])

  return { isFavorite, handleFavorited }
}
