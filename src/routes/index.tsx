import { createFileRoute } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { usePlayerCount } from "@/hooks/usePlayerCount"
import { ServerCarousel } from "./-components/server-carousel"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  const { data } = usePlayerCount()

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-grow flex-col space-y-2 p-4">
        <h1 className="font-base text-lg">Welcome back! 🥰</h1>
        <div className="flex space-x-2">
          <Badge variant="secondary" className="text-base font-light">
            Players Online
          </Badge>
          <Badge variant="outline" className="text-base font-light">
            {data?.response.player_count}
          </Badge>
        </div>
        <div className="self-center text-lg italic text-gray-500">
          Our home page is a work in progress!
        </div>
      </div>
      <div className="flex w-full flex-col items-center p-4">
        <p className="mb-2 border-b text-lg font-semibold">Favorite Servers</p>
        <ServerCarousel />
      </div>
    </div>
  )
}
