import {
  FolderCogIcon,
  FolderInputIcon,
  HeartIcon,
  PlayIcon,
} from "lucide-react"
import { useEffect, useState } from "react"
import { HeartFilledIcon } from "@radix-ui/react-icons"
import { RankGraph } from "@/components/server-rank-graph"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFavoriteServer } from "@/hooks/useFavoriteServer"
import { type Server } from "@/schemas/server-schema"

interface MoreInfoProps {
  open: boolean
  onClose: () => void
  server: Server
}

export function MoreInfo({ open, onClose, server }: MoreInfoProps) {
  const [mounted, setMounted] = useState(false)
  const { isFavorite, handleFavorited } = useFavoriteServer(server)

  // Need to delay the rendering of the chart to prevent the
  // over fetching of data from BM api.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setMounted(true)
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent
        className="min-h-[75vh] select-text"
        onInteractOutside={onClose}
      >
        <DrawerHeader>
          <DrawerTitle>{server.name}</DrawerTitle>
          <DrawerDescription>
            <div className="flex flex-row justify-between">
              <div>{server.addr}</div>
              <div>{server.steamId}</div>
            </div>
          </DrawerDescription>
        </DrawerHeader>
        {/* Main Content Div */}
        <div className="mt-[-10px] flex h-[60vh] justify-between">
          {/* Left Side of server info */}
          <div className="max-w-[50vw] flex-grow p-2">
            {mounted && <RankGraph name={server.name} />}
          </div>

          {/* Right Side of server info */}
          <div className="flex max-w-[50vw] flex-grow flex-col space-y-3 p-2">
            {/* Management Buttons */}
            <div className="flex flex-grow space-x-2">
              <Button className="mt-2 font-thin" onClick={handleFavorited}>
                {isFavorite ? (
                  <HeartFilledIcon className="h-4 w-4 text-red-500" />
                ) : (
                  <HeartIcon className="h-4 w-4" />
                )}
              </Button>
              <Button className="mt-2 font-thin">
                <PlayIcon className="mr-2 h-4 w-4" size={16} />
                Play
              </Button>
              <Button className="mt-2 font-thin">
                <FolderInputIcon className="mr-2 h-4 w-4" size={16} />
                Download Mods
              </Button>
              <Button variant="destructive" className="mt-2 font-thin">
                <FolderCogIcon className="mr-2 h-4 w-4" size={16} />
                Fix Mods
              </Button>
            </div>

            {/* Mod List */}
            <ScrollArea className="max-h-[25vh] flex-grow border-b font-thin">
              <div className="sticky top-0 rounded-t-md border bg-accent">
                <Badge variant="outline" className="border-none text-base">
                  Mod List
                </Badge>
              </div>
              <div className="flex flex-col text-sm">
                {server.modList?.map((mod, idx) => {
                  if (
                    server.modList?.length &&
                    idx === server.modList?.length - 1
                  ) {
                    return (
                      <div key={mod.workshopId} className="p-2">
                        {mod.name}
                      </div>
                    )
                  }

                  return (
                    <div key={mod.workshopId} className="border-b p-2">
                      {mod.name}
                    </div>
                  )
                })}
                {!server.modList && (
                  <div className="p-2 font-thin">No mods installed</div>
                )}
              </div>
            </ScrollArea>

            {/* Server Info */}
            <ScrollArea className="flex flex-grow flex-col border-b font-thin">
              <div className="sticky top-0 rounded-t-md border bg-accent">
                <Badge variant="outline" className="border-none text-base">
                  Server Info
                </Badge>
                <div className="border-b" />
              </div>
              <div className="flex flex-col">
                <div className="mt-1">
                  <Badge variant="outline" className="mr-1 border-none text-sm">
                    Address
                  </Badge>
                  <span className="text-sm font-thin">{server.addr}</span>
                </div>
                <div className="mt-1">
                  <Badge variant="outline" className="mr-1 border-none text-sm">
                    Game Address
                  </Badge>
                  <span className="text-sm font-thin">
                    {server.addr.split(":")[0] + ":" + server.gamePort}
                  </span>
                </div>
                <div className="mt-1">
                  <Badge variant="outline" className="mr-1 border-none text-sm">
                    Players
                  </Badge>
                  <span className="text-sm font-thin">
                    {server.players + "/" + server.maxPlayers}
                  </span>
                </div>
                <div className="mt-1">
                  <Badge variant="outline" className="mr-1 border-none text-sm">
                    Ping
                  </Badge>
                  <span className="text-sm font-thin">{server.ping}ms</span>
                </div>
                <div className="mt-1">
                  <Badge variant="outline" className="mr-1 border-none text-sm">
                    Map
                  </Badge>
                  <span className="text-sm font-thin">{server.map}</span>
                </div>
                <div className="mt-1">
                  <Badge variant="outline" className="mr-1 border-none text-sm">
                    Version
                  </Badge>
                  <span className="text-sm font-thin">{server.version}</span>
                </div>
                <div className="mt-1">
                  <Badge variant="outline" className="mr-1 border-none text-sm">
                    Steam ID
                  </Badge>
                  <span className="text-sm font-thin">{server.steamId}</span>
                </div>
                <div className="mt-1">
                  <Badge variant="outline" className="border-none text-sm">
                    Tags
                  </Badge>
                  {server.gameType.split(",").map((tag, idx) => {
                    return (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="border-none text-sm font-thin"
                      >
                        {tag}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </ScrollArea>

            {/* End of right side */}
          </div>

          {/* End of Main Content Div */}
        </div>
        <DrawerFooter className="mt-[-10px]">
          <div className="flex flex-row justify-between text-xs text-gray-400">
            <div>
              Playerlist&apos;s can only be provided once connected to the
              server!
            </div>

            <div></div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
