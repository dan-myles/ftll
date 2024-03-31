"use client"

import { ServerList, serverListSchema } from "@/app/browser/data/server-schema"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useServerListStore } from "@/stores/server-list-store"
import { window } from "@tauri-apps/api"
import { invoke } from "@tauri-apps/api/core"
import { useEffect, useState } from "react"

export function FTLLContextProvider() {
  const [isLoadingServers, setLoadingServers] = useState(false)
  const [isSteamInitialized, setSteamInitialized] = useState(true)
  const setServerList = useServerListStore((state) => state.setServerList)

  useEffect(() => {
    // Make sure Steam is running
    const checkSteam = async () => {
      const steamRunning = await invoke<boolean>("was_steam_initialized")
      console.log("Steam running: ", steamRunning)
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
          const serverList = await invoke<ServerList>("get_server_list")
          serverListSchema.parse(serverList)
          setServerList(serverList)
          setLoadingServers(false)
        } else {
          setLoadingServers(false)
        }
      }
    }

    const init = async () => {
      const steamRunning = await checkSteam()
      if (!steamRunning) return

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
