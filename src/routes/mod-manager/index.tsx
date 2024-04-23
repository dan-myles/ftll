import { Hammer, Trash2 } from "lucide-react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useInstalledMods } from "@/hooks/useInstalledMods"

export const Route = createFileRoute("/mod-manager/")({
  component: Index,
})

function Index() {
  const { modList } = useInstalledMods()

  return (
    <div className="flex h-full flex-col space-y-2 p-4">
      <div>
        <p className="mb-2 max-w-fit text-lg font-semibold">Pending Mods</p>
        <ScrollArea className="h-[20vh] rounded-md border">
          <div className="flex h-full flex-grow flex-col">
            <div className="pt-2 text-center text-gray-500">
              No mods pending installation
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="pt-8">
        <p className="max-w-fit text-lg font-semibold">Installed Mods</p>
      </div>
      <ScrollArea className="rounded-md border">
        <div className="flex flex-grow flex-col">
          {modList.map((mod, idx) => (
            <div
              key={mod.published_file_id}
              className={
                "flex flex-row space-x-2 p-2" + (idx === 0 ? "" : " border-t")
              }
            >
              <div className="flex-grow">{mod.title}</div>
              <div className="flex flex-row space-x-2 pr-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                      <DotsHorizontalIcon className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem>
                      <Hammer size={16} className="mr-2" />
                      Force Fix
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash2 size={16} className="mr-2" />
                      Uninstall
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
