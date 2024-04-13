import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ModsPage() {
  return (
    <div className="flex h-full flex-row space-x-2 p-4">
      <div className="flex flex-col space-y-4">
        <Input placeholder="Search for mod names..." />
        <Button>Reset</Button>
        <div className="border-b" />
      </div>
      <div className="h-full flex-grow rounded-md border">Table goes here</div>
    </div>
  )
}
