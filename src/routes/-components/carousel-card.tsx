import { Play } from "lucide-react"
import { useEffect, useState } from "react"
import { MoreInfoButton } from "@/components/more-info-button"
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
            <Button variant="secondary" className="h-8">
              <Play size={16} />
            </Button>
            <div className="flex h-8">
              <MoreInfoButton initServer={server} />
            </div>
          </div>
        </Card>
      </div>
    </CarouselItem>
  )
}
