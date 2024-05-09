import { useEffect, useState } from "react"
import { useFavoriteServerStore } from "@/stores/favorite-server-store"
import { type Server32 } from "@/tauri-bindings"

export function useFavoriteServer(s: Server32) {
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
