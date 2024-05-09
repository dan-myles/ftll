import { type ReactNode, useEffect } from "react"
import { exit } from "@tauri-apps/plugin-process"
import tryingUrl from "@/assets/trying.gif"
import zombieUrl from "@/assets/zombie.gif"
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
import { useServerList } from "@/hooks/useServerList"
import { useSteamworks } from "@/hooks/useSteamworks"
import { useUserInfo } from "@/hooks/useUserInfo"
import { commands } from "@/tauri-bindings"

export function FTLLContextProvider({ children }: { children: ReactNode }) {
  const { isSteamReady } = useSteamworks()
  const { isLoadingServers } = useServerList()
  const { hasInfo } = useUserInfo()

  // Start an interval scanning for mods
  useEffect(() => {
    if (!isSteamReady) return

    commands.steamGetInstalledMods().catch(console.error)
    const interval = setInterval(() => {
      commands.steamGetInstalledMods().catch(console.error)
    }, 1000 /*Ms*/ * 3 /*Seconds*/)

    return () => clearInterval(interval)
  }, [isSteamReady])

  return (
    <>
      <AlertDialog open={!isSteamReady || !hasInfo}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Uh oh... 😭</AlertDialogTitle>
            <AlertDialogDescription>
              It looks like Steam isn&apos;t running, or your client is
              out-of-date! Please start Steam and try again.
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
          <div className="flex w-full justify-center">
            <div className="">
              <img src={zombieUrl} alt="zombie" />
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      {children}
    </>
  )
}
