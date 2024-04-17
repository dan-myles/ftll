import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const Route = createFileRoute("/mod-manager/")({
  component: Index,
})

function Index() {
  return (
    <div className="flex h-full flex-row space-x-2 p-4">
      <div className="flex flex-col space-y-4">
        <Input placeholder="Search for mod names..." />
        <Button>Reset</Button>
        <div className="border-b" />
      </div>
      <div className="flex-grow rounded-md border p-4">Table goes here</div>
    </div>
  )
}

