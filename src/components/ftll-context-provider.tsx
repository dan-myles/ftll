"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useServerListStore } from "@/stores/server-list-store"
import { useUserInfoStore } from "@/stores/user-info-store"
import { ServerList, serverListSchema } from "@/validators/ftla/server-schema"
import { window } from "@tauri-apps/api"
import { invoke } from "@tauri-apps/api/core"
import { useEffect, useState } from "react"

export function FTLLContextProvider() {
  const [isLoadingServers, setLoadingServers] = useState(false)
  const [isSteamInitialized, setSteamInitialized] = useState(true)
  const { setUserName, setSteamId, setAvi } = useUserInfoStore((state) => state)
  const setServerList = useServerListStore((state) => state.setServerList)

  useEffect(() => {
    // Make sure Steam is running
    const checkSteam = async () => {
      const steamRunning = await invoke<boolean>("was_steam_initialized")
      if (!steamRunning) {
        setSteamInitialized(false)
        setTimeout(() => {
          window.getCurrent().close()
        }, 3500)
      }

      return steamRunning
    }

    // Load locally cached servers
    const loadServers = async () => {
      setLoadingServers(true)
      await useServerListStore.persist.rehydrate()

      if (useServerListStore.persist.hasHydrated()) {
        if (useServerListStore.getState().serverList.length === 0) {
          const res = await invoke<ServerList>("get_server_list").catch((e) => {
            console.error(e)
            setLoadingServers(false)
          })
          const serverList = serverListSchema.parse(res)
          setServerList(serverList)
          setLoadingServers(false)
        } else {
          setLoadingServers(false)
        }
      }
    }

    const getUserInfo = async () => {
      const userName = await invoke<string>("get_user_display_name")
      const steamId = await invoke<string>("get_user_steam_id")
      const avi = await invoke<Uint8Array>("get_user_avi_rgba")
      setUserName(userName)
      setSteamId(steamId)
      setAvi(avi)
    }

    const init = async () => {
      const steamRunning = await checkSteam()
      if (!steamRunning) {
        return
      }

      await getUserInfo()
      await loadServers()
    }

    init()
  }, [])

  return (
    <>
      <AlertDialog open={isLoadingServers}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Give me a moment... 🔎</AlertDialogTitle>
            <AlertDialogDescription>
              I&apos;m importing some new servers for you! Hold on a second and
              I&apos;ll be done before you can say
              &ldquo;supercalafragilisticexpialidocious&ldquo;!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="">
            <div className="flex w-full justify-center">
              <div className="">
                <img src="/zombie-bloody.gif" alt="zombie" />
              </div>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={!isSteamInitialized}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Uh oh... 😭</AlertDialogTitle>
            <AlertDialogDescription>
              It looks like Steam isn&apos;t running! Please start Steam and try
              again. I&apos;m going to shut down now.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="">
            <div className="flex w-full justify-center">
              <div className="">
                <img src="/trying.gif" alt="zombie" height={200} width={200} />
              </div>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
