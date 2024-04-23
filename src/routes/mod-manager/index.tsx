import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useInstalledMods } from "@/hooks/useModList"

export const Route = createFileRoute("/mod-manager/")({
  component: Index,
})

function Index() {
  const { modList } = useInstalledMods()

  return (
    <div className="flex h-full flex-row space-x-2 p-4">
      <div className="flex flex-col space-y-4">
        <Input placeholder="Search for mod names..." />
        <Button>Reset</Button>
        <div className="border-b" />
      </div>
      <div className="flex h-full flex-grow flex-col rounded-md border">
        <ScrollArea>
          {modList.map((mod) => (
            <div key={mod.published_file_id} className="flex flex-row p-2">
              <div className="flex-grow">{mod.title}</div>
              <div className="flex flex-row space-x-2">
                <Button>Enable</Button>
                <Button>Disable</Button>
                <Button>Uninstall</Button>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}
