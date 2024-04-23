import { useEffect } from "react"
import { invoke } from "@tauri-apps/api/core"
import { listen } from "@tauri-apps/api/event"
import { type ModInfo } from "@/schemas/mod-info"
import { useModListStore } from "@/stores/mod-list-store"

// NOTE: We can move this to FTLLContextProvider if we want to
export function useInstalledMods() {
  const { addMod, modList } = useModListStore()

  useEffect(() => {
    // Listen for installed mods
    // Due to how the Steamworks API works, we can't await the response
    // we have to listen for a callback event instead
    const unlisten = listen("found_installed_mod", (event) => {
      const modInfo = event.payload as ModInfo
      addMod(modInfo)
    }).catch(console.error)

    // Now that we're listening for installed mods, we can request the list
    invoke("get_installed_mods").catch(console.error)
    const interval = setInterval(() => {
      invoke("get_installed_mods").catch(console.error)
    }, 1000 /*Ms*/ * 10 /*Seconds*/)

    return () => {
      unlisten.then((f) => f?.()).catch(console.error)
      clearInterval(interval)
    }
    // eslint-disable-next-line
  }, [])

  return { modList }
}
