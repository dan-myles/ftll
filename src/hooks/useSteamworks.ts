import { useEffect } from "react"
import { useSteamInitStore } from "@/stores/steam-init-store"
import { commands } from "@/tauri-bindings"

export function useSteamworks() {
  const { isSteamReady, setIsSteamReady } = useSteamInitStore()

  useEffect(() => {
    async function initSteamworks() {
      if (isSteamReady) return

      const ready = await commands.steamMountApi()
      if (ready.status === "error") {
        console.error(ready.error)
        setIsSteamReady(false)
        return
      }

      const steamDaemon = await commands.steamStartDaemon()
      if (steamDaemon.status === "error") {
        console.error(steamDaemon.error)
        setIsSteamReady(false)
        return
      }

      const modDeamon = await commands.mdqStartDaemon()
      if (modDeamon.status === "error") {
        console.error(modDeamon.error)
        setIsSteamReady(false)
        return
      }

      setIsSteamReady(true)
    }

    initSteamworks().catch(console.error)
  }, [isSteamReady, setIsSteamReady])

  return { isSteamReady }
}
