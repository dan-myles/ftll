import { createFileRoute } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { usePlayerCount } from "@/hooks/usePlayerCount"
import { useFavoriteServerStore } from "@/stores/favorite-server-store"
import { ServerCarousel } from "./-components/server-carousel"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  const { data } = usePlayerCount()
  const { serverList } = useFavoriteServerStore()

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-grow flex-col space-y-2 p-4">
        <div className="flex space-x-2">
          <Badge variant="secondary" className="text-base font-light">
            Players Online
          </Badge>
          <Badge variant="outline" className="text-base font-light">
            {data?.response.player_count}
          </Badge>
        </div>
        <div
          className="flex flex-grow flex-col self-center text-lg italic
            text-gray-500 dark:text-gray-400"
        >
          <p className="mb-auto mt-auto">
            Our home page is a work in progress!
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col items-center p-4">
        <p className="mb-2 border-b text-lg font-semibold">Favorite Servers</p>
        {serverList.length === 0 && (
          <div
            className="flex h-56 w-[75vw] flex-col rounded-md border text-center
              text-gray-500 dark:text-gray-400"
          >
            <div className="mb-auto mt-auto self-center">
              You have no favorite servers!
            </div>
          </div>
        )}
        <ServerCarousel />
      </div>
    </div>
  )
}
