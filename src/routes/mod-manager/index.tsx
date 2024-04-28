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
import { useModDownloadQueue } from "@/stores/mod-download-queue"
import { useModListStore } from "@/stores/mod-list-store"
import { Test } from "./-test"

export const Route = createFileRoute("/mod-manager/")({
  component: Index,
})

function Index() {
  const { modList } = useModListStore()
  const { downloadQueue } = useModDownloadQueue()

  return (
    <div className="flex h-full flex-col space-y-2 p-4">
      <div>
        <p className="mb-2 max-w-fit text-lg font-semibold">Pending Mods</p>
        <ScrollArea className="h-[20vh] rounded-md border">
          <div className="flex h-full flex-grow flex-col">
            {downloadQueue.map((mod, idx) => (
              <div
                key={idx}
                className={
                  "flex flex-row space-x-2 p-2" + (idx === 0 ? "" : " border-t")
                }
              >
                <div className="inline-flex flex-grow">
                  <div>{mod.name}</div>
                  <div className="pl-4 text-gray-500">{mod.workshopId}</div>
                </div>
                <div className="flex flex-row space-x-2 pr-2">
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <Trash2 size={16} />
                    <span className="sr-only">Cancel</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Test />
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
              <div className="inline-flex flex-grow">
                <div>{mod.title}</div>
                <div className="pl-4 text-gray-500">
                  {mod.published_file_id}
                </div>
              </div>
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
          {modList.length === 0 && (
            <div
              className="flex min-h-[20vh] flex-grow items-center justify-center
                text-gray-500"
            >
              You have no mods installed! (Or they're not showing up here for
              some reason)
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
