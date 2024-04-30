import { Info, Play } from "lucide-react"
import { useEffect, useState } from "react"
import { MoreInfo } from "@/components/more-info"
import { ServerPlayValidator } from "@/components/server-play-validator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { CarouselItem } from "@/components/ui/carousel"
import { maps } from "@/data/map-filter-data"
import { useUpdateServer } from "@/hooks/useUpdateServer"
import { type Server } from "@/schemas/server-schema"

export function CarouselCard({ initServer }: { initServer: Server }) {
  const [server, setServer] = useState(initServer)
  const newServer = useUpdateServer(server)

  useEffect(() => {
    if (newServer) {
      setServer(newServer)
    }
  }, [newServer])

  if (!server) return null

  return (
    <CarouselItem className="flex basis-1/3 flex-col pl-1">
      <div className="flex-grow p-1">
        <Card className="h-full p-4">
          <CardTitle className="truncate">{server.name}</CardTitle>
          <CardDescription className="truncate text-xs">
            {server.addr.split(":")[0] + ":" + server.gamePort}
          </CardDescription>
          <CardContent
            className="ml-[-25px] mt-[-10px] flex flex-col space-y-2 p-6 text-sm"
          >
            <div className="flex space-x-2">
              <Badge variant="secondary">Status</Badge>
              {server.ping !== 99999 ? (
                <Badge className="bg-green-500 dark:bg-green-200">Online</Badge>
              ) : (
                <Badge className="bg-red-400">Offline</Badge>
              )}
            </div>
            <div className="flex space-x-2">
              <Badge variant="secondary">Players</Badge>
              <Badge variant="outline">
                {server.players + "/" + server.maxPlayers}
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Badge variant="secondary">Ping</Badge>
              <Badge variant="outline">{server.ping + "ms"}</Badge>
            </div>
            <div className="flex space-x-2">
              <Badge variant="secondary">Map</Badge>
              <Badge variant="outline">
                {maps.find((m) => m.value === server.map)?.label ?? server.map}
              </Badge>
            </div>
          </CardContent>
          <div className="mt-[-10px] flex justify-between">
            <ServerPlayValidator server={server}>
              <div
                className="inline-flex h-8 w-10 items-center justify-center
                  whitespace-nowrap rounded-md bg-secondary text-sm font-medium
                  text-secondary-foreground shadow-sm transition-colors
                  hover:bg-secondary/80 focus-visible:outline-none
                  focus-visible:ring-1 focus-visible:ring-ring
                  disabled:pointer-events-none disabled:opacity-50"
              >
                <Play size={16} />
              </div>
            </ServerPlayValidator>
            <div className="flex h-8">
              <MoreInfo initServer={server}>
                <Info size={16} />
              </MoreInfo>
            </div>
          </div>
        </Card>
      </div>
    </CarouselItem>
  )
}
