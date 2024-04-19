import { createFileRoute } from "@tanstack/react-router"
import { usePlayerCount } from "@/hooks/usePlayerCount"
import { ServerCarousel } from "./-components/server-carousel"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  const { data } = usePlayerCount()

  return (
    <div
      className="flex h-full w-[calc(100vw-52px)] flex-col justify-between p-2"
    >
      <div className=" flex flex-grow flex-row justify-between">
        <div className="text-base font-semibold">Hello, welcome back 💘</div>
        <div className=":w max-w-fit text-lg">
          {data?.response.player_count}{" "}
          <span className="font-sans">Players Online</span>
        </div>
      </div>
      <div className="">
        <ServerCarousel />
      </div>
    </div>
  )
}
