import { createFileRoute } from "@tanstack/react-router"
import { useFavoriteServerStore } from "@/stores/favorite-server-store"
import { ServerCarousel } from "./-components/server-carousel"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  const { serverList } = useFavoriteServerStore()

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-grow flex-col space-y-2 p-4">
        <div className="h-full">
          <p className="text-lg font-semibold">Server Information</p>
          <div className="h-full">You are not connected to any server!</div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center p-4">
        <p className="mb-2 text-lg font-semibold">Favorite Servers</p>
        {serverList.length === 0 ? (
          <div
            className="flex h-56 w-[75vw] flex-col rounded-md border text-center
              text-gray-500 dark:text-gray-400"
          >
            <div className="mb-auto mt-auto self-center">
              You have no favorite servers!
            </div>
          </div>
        ) : (
          <ServerCarousel />
        )}
      </div>
    </div>
  )
}
