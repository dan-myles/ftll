import { type ReactNode, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "@tanstack/react-router"
import { invoke } from "@tauri-apps/api/core"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { type Server } from "@/schemas/server-schema"
import { useModDownloadQueue } from "@/stores/mod-download-queue"
import { ScrollArea } from "./ui/scroll-area"

interface ServerDownloadValidatorProps {
  server: Server
  children?: ReactNode
}

export function ServerDownloadValidator({
  server,
  children,
}: ServerDownloadValidatorProps) {
  const [missingMods, setMissingMods] = useState<number[] | null>(null)
  const [open, setOpen] = useState(false)
  const { pushMod } = useModDownloadQueue()
  const navigate = useRouter().navigate

  const handleChange = (e: boolean) => {
    setOpen(e)
  }

  const handleDownload = async () => {
    if (!server.modList) return
    if (!missingMods) return

    for (const mod of missingMods) {
      invoke("mdq_mod_add", { publishedFileId: mod }).catch(console.error)

      // Catch a name
      let name = server.modList.find((m) => m.workshopId === mod)?.name
      if (!name) name = "Unknown Mod"

      pushMod({ workshopId: mod, name: name }).catch(console.error)
    }

    navigate({ to: "/mod-manager" }).catch(console.error)
  }

  const checkMissingMods = async () => {
    if (!server.modList) return

    const missing = await invoke("steam_get_missing_mods_for_server", {
      requiredMods: server.modList.map((mod) => mod.workshopId),
    }).catch(console.error)

    const missingMods = missing as number[]
    setMissingMods(missingMods)

    if (missingMods.length > 0) {
      setOpen(true)
    } else {
      const shortName =
        server.name.length > 45
          ? server.name.substring(0, 45) + "..."
          : server.name

      toast.success("You aren't missing any mods!", {
        description: shortName,
        position: "bottom-center",
      })
    }
  }

  return (
    <>
      <AlertDialog open={open} onOpenChange={handleChange}>
        <div onClick={checkMissingMods}>{children}</div>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="max-w-[450px] truncate">
              Uh oh! You're missing some mods! 😥
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div
                className="max-w-fit truncate pb-2 text-sm font-normal
                  text-secondary-foreground"
              >
                <div>{server.name}</div>
                <div className="text-xs text-gray-500">
                  {server.addr.split(":")[0] + ":" + server.gamePort}
                </div>
              </div>
              <ScrollArea
                className="max-h-[20vh] overflow-y-visible rounded-md border
                  pb-2 pl-2 pt-1 text-accent-foreground"
              >
                {missingMods?.map((mod, idx) => (
                  <div key={idx}>
                    {server.modList?.find((m) => m.workshopId === mod)?.name}
                  </div>
                ))}
              </ScrollArea>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDownload}>
              Download
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
