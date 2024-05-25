import { useEffect, useState } from "react"
import { useSteamInitStore } from "@/stores/steam-init-store"
import { useUserInfoStore } from "@/stores/user-info-store"
import { commands } from "@/tauri-bindings"

export function useUserInfo() {
  // We assume the user has info until we know otherwise
  // This prevents too many dialogs from popping up on refresh
  const [hasInfo, setInfo] = useState(true)
  const { isSteamReady } = useSteamInitStore()
  const { setUserName, setSteamId, setAvi } = useUserInfoStore()

  useEffect(() => {
    async function getUserInfo() {
      if (!isSteamReady) return

      // Get Display Name
      const username = await commands.steamGetUserDisplayName()
      if (username.status === "error") {
        console.error(username.error)
        return
      }
      setUserName(username.data)

      // Get Steam ID
      const steamId = await commands.steamGetUserId()
      if (steamId.status === "error") {
        console.error(steamId.error)
        return
      }
      setSteamId(steamId.data)

      // Get Avatar
      const avi = await commands.steamGetUserAvi()
      if (avi.status === "error") {
        console.error(avi.error)
        return
      }
      setAvi(avi.data)

      // Return success!
      setInfo(true)
    }

    getUserInfo().catch(console.error)
  }, [isSteamReady, setInfo, setAvi, setSteamId, setUserName])

  return { hasInfo }
}
