import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/settings/")({
  component: Index,
})

function Index() {
  return (
    <div className="flex h-full flex-col items-center">
      <div className="mb-auto mt-auto text-gray-400 dark:text-gray-500">
        Uhoh! This page is still under construction!
      </div>
    </div>
  )
}
