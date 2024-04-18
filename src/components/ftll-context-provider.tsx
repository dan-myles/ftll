import { useEffect, useState } from "react"
import { type ReactNode } from "react"
import { useRouter } from "@tanstack/react-router"
import { invoke } from "@tauri-apps/api/core"
import { exit } from "@tauri-apps/plugin-process"
import tryingUrl from "@/assets/trying.gif"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { type ServerList, serverListSchema } from "@/schemas/ftla/server-schema"
import { useServerListStore } from "@/stores/server-list-store"
import { useUserInfoStore } from "@/stores/user-info-store"

export function FTLLContextProvider({ children }: { children: ReactNode }) {
  const [isLoadingServers, setLoadingServers] = useState(false)
  const [isSteamInitialized, setSteamInitialized] = useState(true)
  const { setUserName, setSteamId, setAvi } = useUserInfoStore((state) => state)
  const setServerList = useServerListStore((state) => state.setServerList)
  const router = useRouter()

  async function init() {
    const steamRunning = await invoke("init_steamworks").catch((e) => {
      console.error(e)
      setSteamInitialized(false)
    })

    // // Load locally cached servers
    // const loadServers = async () => {
    //   setLoadingServers(true)
    //   await useServerListStore.persist.rehydrate()
    //
    //   if (useServerListStore.persist.hasHydrated()) {
    //     if (useServerListStore.getState().serverList.length === 0) {
    //       const res = await invoke<ServerList>("get_server_list").catch((e) => {
    //         console.error(e)
    //         setLoadingServers(false)
    //       })
    //       const serverList = serverListSchema.parse(res)
    //       setServerList(serverList)
    //       setLoadingServers(false)
    //     } else {
    //       setLoadingServers(false)
    //     }
    //   }
    // }
    //
    // const getUserInfo = async () => {
    //   const userName = await invoke<string>("get_user_display_name")
    //   const steamId = await invoke<string>("get_user_steam_id")
    //   const avi = await invoke<Uint8Array>("get_user_avi_rgba")
    //   setUserName(userName)
    //   setSteamId(steamId)
    //   setAvi(avi)
    // }
  }

  useEffect(() => {
    (async () => {
      await init()
    })().catch((e) => {
      console.error(e)
    })
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
              again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex w-full justify-center">
            <div className="">
              <img src={tryingUrl} alt="trying" height={200} width={200} />
            </div>
          </div>
          <AlertDialogFooter className="">
            <AlertDialogCancel onClick={() => void exit(1)}>
              Quit
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => window.location.reload()}>
              Retry
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {children}
    </>
  )
}
