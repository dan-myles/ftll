import { useEffect, useState } from "react"
import { useServerListStore } from "@/stores/server-list-store"
import { useSteamInitStore } from "@/stores/steam-init-store"
import { commands } from "@/tauri-bindings"

export function useServerList() {
  const [isLoadingServers, setIsLoadingServers] = useState(false)
  const { setServerList } = useServerListStore()
  const { isSteamReady } = useSteamInitStore()

  useEffect(() => {
    async function getServerList() {
      if (!isSteamReady) return

      // Persist the store and check if it has hydrated
      await useServerListStore.persist.rehydrate()
      if (!useServerListStore.persist.hasHydrated()) return
      if (useServerListStore.getState().serverList.length > 0) return

      // Start to load the server list
      setIsLoadingServers(true)
      const servers = await commands.getServerList()

      // Check for errors
      if (servers.status === "error") {
        console.error(servers.error)
        setIsLoadingServers(false)
        return
      }

      // Set the server list
      setServerList(servers.data)
      setIsLoadingServers(false)
    }

    getServerList().catch(console.error)
  }, [isSteamReady, setServerList])

  return { isLoadingServers }
}
