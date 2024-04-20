import { createFileRoute } from "@tanstack/react-router"
import { usePlayerCount } from "@/hooks/usePlayerCount"
import { ServerCarousel } from "./-components/server-carousel"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  const { data } = usePlayerCount()

  return (
    <div className="flex h-full flex-col">
      <div className="flex-grow">test</div>
      <div className="flex w-full flex-col items-center p-4">
        <ServerCarousel />
      </div>
    </div>
  )
}
