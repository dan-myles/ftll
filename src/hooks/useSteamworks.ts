import { useEffect } from "react"
import { useSteamStore } from "@/stores/steam-init-store"
import { commands } from "@/tauri-bindings"

export function useSteamworks() {
  const { isSteamReady, setIsSteamReady } = useSteamStore()

  useEffect(() => {
    async function initSteamworks() {
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
  }, [setIsSteamReady])

  return { isSteamReady }
}
