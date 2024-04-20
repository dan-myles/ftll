import { Info, Play } from "lucide-react"
import { useEffect, useState } from "react"
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
import { type Server } from "@/schemas/ftla/server-schema"
import { MoreInfo } from "../server-browser/-components/more-info"

export function CarouselCard({
  initServer,
  key,
}: {
  initServer: Server
  key: number
}) {
  const [server, setServer] = useState(initServer)
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const newServer = useUpdateServer(server)

  useEffect(() => {
    if (newServer) {
      setServer(newServer)
    }
  }, [newServer])

  return (
    <CarouselItem key={key} className="flex basis-1/3 flex-col pl-1">
      <div className="flex-grow p-1">
        <Card className="h-full p-4">
          <CardTitle className="truncate">{server.name}</CardTitle>
          <CardDescription className="truncate text-xs">
            {server.addr.split(":")[0] + ":" + server.gamePort}
          </CardDescription>
          <CardContent className="ml-[-25px] flex flex-col space-y-2 p-6 text-sm">
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
            <div className="flex space-x-2">
              <Badge variant="secondary">Version</Badge>
              <Badge variant="outline">{server.version}</Badge>
            </div>
          </CardContent>
          <div className="mt-[-8px] flex justify-between">
            <Button
              variant="secondary"
              className="mb-[-8px]"
              onClick={handleOpen}
            >
              <Info size={16} />
              <MoreInfo server={server} open={open} onClose={handleClose} />
            </Button>
            <Button variant="secondary" className="mb-[-8px]">
              <Play size={16} />
            </Button>
          </div>
        </Card>
      </div>
    </CarouselItem>
  )
}
