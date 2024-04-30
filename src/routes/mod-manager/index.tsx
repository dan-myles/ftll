import { FileWarning, Hammer, OctagonX, Trash2 } from "lucide-react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { createFileRoute } from "@tanstack/react-router"
import { invoke } from "@tauri-apps/api/core"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatBytes } from "@/lib/utils"
import { type ModInfo } from "@/schemas/mod-info"
import { useModDownloadQueue } from "@/stores/mod-download-queue"
import { useModListStore } from "@/stores/mod-list-store"
import { PendingMod } from "./-components/pending-mod"

export const Route = createFileRoute("/mod-manager/")({
  component: Index,
})

function Index() {
  const { modList, removeMod } = useModListStore()
  const { downloadQueue, pushFix } = useModDownloadQueue()

  const remove = (id: number) => {
    invoke("steam_remove_mod", { publishedFileId: id }).catch(console.error)
  }

  const forceRemove = (id: number) => {
    invoke("steam_remove_mod_forcefully", { publishedFileId: id }).catch(
      console.error
    )
  }

  const fix = (mod: ModInfo) => {
    pushFix(
      { workshopId: mod.published_file_id, name: mod.title },
      false
    ).catch(console.error)
  }

  const forceFix = (mod: ModInfo) => {
    pushFix({ workshopId: mod.published_file_id, name: mod.title }, true).catch(
      console.error
    )
    removeMod(mod.published_file_id)
  }

  return (
    <div className="flex h-full flex-col space-y-2 p-4">
      {downloadQueue.length > 0 && (
        <div className="pb-8">
          <p className="mb-2 max-w-fit text-lg font-semibold">Pending Mods</p>
          <ScrollArea className="h-[25vh] rounded-md border">
            <div className="flex h-full flex-grow flex-col">
              {downloadQueue.map((mod, idx) => (
                <PendingMod
                  key={mod.workshopId}
                  mod={mod}
                  className={idx === 0 ? "" : " border-t"}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <div className="inline-flex items-center space-x-2">
        <p className="max-w-fit text-lg font-semibold">Installed Mods</p>
        <Badge variant="secondary" className="h-5">
          {modList.length > 0 &&
            (modList.length === 1 ? "1 Mod" : `${modList.length} Mods`)}
        </Badge>
        <div className="text-xs text-muted-foreground">
          {formatBytes(
            modList.map((mod) => mod.file_size).reduce((a, b) => a + b, 0)
          )}
        </div>
      </div>
      <ScrollArea className="rounded-md border">
        <div className="flex flex-grow flex-col">
          {modList
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((mod, idx) => (
              <div
                key={mod.published_file_id}
                className={
                  "flex flex-row space-x-2 p-2" + (idx === 0 ? "" : " border-t")
                }
              >
                <div className="inline-flex flex-grow items-center">
                  <div>{mod.title}</div>
                  <div className="pl-2 text-xs text-gray-500">
                    {mod.published_file_id}
                  </div>
                  <div className="pl-2 text-xs text-gray-500">
                    {formatBytes(mod.file_size) === "0 Bytes"
                      ? "You recently force fixed this mod!"
                      : formatBytes(mod.file_size)}
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
                      <DropdownMenuItem onClick={() => fix(mod)}>
                        <Hammer size={16} className="mr-2" />
                        Fix
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => forceFix(mod)}>
                        <FileWarning size={16} className="mr-2" />
                        Force Fix
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => remove(mod.published_file_id)}
                      >
                        <Trash2 size={16} className="mr-2" />
                        Remove
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => forceRemove(mod.published_file_id)}
                      >
                        <OctagonX size={16} className="mr-2" />
                        Force Remove
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
