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
import { useCurrentServerStore } from "@/stores/current-server-store"
import { useModDownloadQueue } from "@/stores/mod-download-queue"
import { type Server32 } from "@/tauri-bindings"
import { ScrollArea } from "./ui/scroll-area"

interface ServerPlayValidatorProps {
  server: Server32
  children?: ReactNode
}

export function ServerPlayValidator({
  server,
  children,
}: ServerPlayValidatorProps) {
  const [isMissingMods, setIsMissingMods] = useState(false)
  const [missingMods, setMissingMods] = useState<number[] | null>(null)
  const [open, setOpen] = useState(false)
  const { pushMod } = useModDownloadQueue()
  const { setServer } = useCurrentServerStore()
  const navigate = useRouter().navigate

  const handleChange = (e: boolean) => {
    setIsMissingMods(e)
  }

  const handleDialogChange = (e: boolean) => {
    setOpen(e)
  }

  const handleDownload = async () => {
    if (!server.mod_list) return
    if (!missingMods) return

    for (const mod of missingMods) {
      invoke("mdq_mod_add", { publishedFileId: mod }).catch(console.error)

      // Catch a name
      let name = server.mod_list.find(
        (m) => Number(m.workshop_id) === mod
      )?.name
      if (!name) name = "Unknown Mod"

      pushMod({ workshop_id: String(mod), name: name }).catch(console.error)
    }

    navigate({ to: "/mod-manager" }).catch(console.error)
  }

  const handlePlay = async () => {
    if (!server.mod_list) return

    const missing = await invoke("steam_get_missing_mods_for_server", {
      requiredMods: server.mod_list.map((mod) => mod.workshop_id),
    }).catch(console.error)
    const missingMods = missing as number[]

    if (missingMods.length > 0) {
      setIsMissingMods(true)
      setMissingMods(missingMods)
      return
    }

    const success = await invoke("dayz_launch_modded", {
      server: server,
    }).catch(console.error)

    if (success === null) {
      const shortName =
        server.name.length > 45
          ? server.name.substring(0, 45) + "..."
          : server.name

      toast.success("Successfully loaded mods & launched DayZ", {
        description: shortName,
        position: "bottom-center",
      })

      setServer(server)
    }
  }

  return (
    <>
      <AlertDialog open={open} onOpenChange={handleDialogChange}>
        <div onClick={() => handleDialogChange(true)}>{children}</div>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="max-w-[450px] truncate">
              {server.name}
              <p
                className="truncate text-sm font-normal
                  text-secondary-foreground"
              >
                {server.addr.split(":")[0] + ":" + server.game_port}
              </p>
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to connect to this server! If you do not have the
              mods for this server downloaded, we'll download them for you.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePlay}>Play</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={isMissingMods} onOpenChange={handleChange}>
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
                  {server.addr.split(":")[0] + ":" + server.game_port}
                </div>
              </div>
              <ScrollArea
                className="max-h-[20vh] overflow-y-visible rounded-md border
                  pb-2 pl-2 pt-1 text-accent-foreground"
              >
                {missingMods?.map((mod, idx) => (
                  <div key={idx}>
                    {
                      server.mod_list?.find(
                        (m) => Number(m.workshop_id) === mod
                      )?.name
                    }
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
