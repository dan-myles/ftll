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
  AlertDialogTrigger,
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

  const handleChange = (e: boolean) => {
    setOpen(e)
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
        <AlertDialogTrigger onClick={checkMissingMods}>
          {children}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="max-w-[450px] truncate">
              {server.name}
              <p
                className="truncate text-sm font-normal
                  text-secondary-foreground"
              >
                {server.addr.split(":")[0] + ":" + server.gamePort}
              </p>
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to connect to this server! If you do not have the
              mods for this server downloaded, we'll download them for you.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Download</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
