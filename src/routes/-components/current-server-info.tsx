import { useCallback, useEffect, useState } from "react"
import { SteamPFPMedium } from "@/components/steam-pfp-medium"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCurrentServerStore } from "@/stores/current-server-store"
import { type Player, commands } from "@/tauri-bindings"

export function CurrentServerInfo() {
  const { server } = useCurrentServerStore()
  const [playerList, setPlayerList] = useState<Player[]>([])

  // Grab the player list from the server
  useEffect(() => {
    const getPlayerList = async () => {
      // Check if the server is set
      if (!server) return

      // Grab the list
      const list = await commands.dayzGetPlayerlist(server)
      if (list.status === "error") {
        console.error(list.error)
        return
      }

      setPlayerList(list.data)
    }

    getPlayerList().catch(console.error)

    const interval = setInterval(() => {
      getPlayerList().catch(console.error)
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [server])

  const open = useCallback(async (url: string) => {
    const { open } = await import("@tauri-apps/plugin-shell")
    open(url).catch(console.error)
  }, [])

  return (
    <>
      <p className="text-lg font-semibold">{server?.name}</p>
      <div className="h-full">
        <p className="text-gray-500">{server?.addr}</p>
        <ScrollArea>
          <div className="mt-2 grid max-h-[25vh] grid-cols-4 gap-2 p-2">
            {playerList.map((player, idx) => (
              <div
                key={idx}
                className="inline-flex h-10 cursor-pointer items-center
                  space-x-2 rounded-md p-2 transition-colors hover:bg-muted
                  hover:bg-opacity-10 dark:hover:bg-opacity-10"
                onClick={() =>
                  open(`https://steamcommunity.com/profiles/${player.steam_id}`)
                }
              >
                <SteamPFPMedium className="rounded-md" rgba={player.avatar} />
                <div className="text-primary">{player.name}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
