import { useEffect, useState } from "react"
import { listen } from "@tauri-apps/api/event"
import { Progress } from "@/components/ui/progress"
import { cn, formatBytes } from "@/lib/utils"
import { type ActiveDownloadProgressEvent } from "@/schemas/events/active-download-progress"
import { type Mod } from "@/schemas/server-schema"

interface PendingModProps {
  mod: Mod
  className?: string
}

export function PendingMod({ mod, className }: PendingModProps) {
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null)
  const [totalBytes, setTotalBytes] = useState(0)
  const [downloadedBytes, setDownloadedBytes] = useState(0)

  useEffect(() => {
    const unlisten = listen("mdq_active_download_progress", (event) => {
      const e = event.payload as ActiveDownloadProgressEvent

      if (e.published_file_id !== mod.workshopId) return

      setDownloadProgress(e.percentage_downloaded)
      setDownloadedBytes(e.bytes_downloaded)
      setTotalBytes(e.bytes_total)
    }).catch(console.error)

    const unlisten2 = listen("steam_fix_mod_forcefully_progress", (event) => {
      const e = event.payload as ActiveDownloadProgressEvent

      if (e.published_file_id !== mod.workshopId) return

      setDownloadProgress(e.percentage_downloaded)
      setDownloadedBytes(e.bytes_downloaded)
      setTotalBytes(e.bytes_total)
    }).catch(console.error)

    return () => {
      unlisten.then((f) => f?.()).catch(console.error)
      unlisten2.then((f) => f?.()).catch(console.error)
    }
  }, [mod.workshopId])

  return (
    <div className={cn("flex flex-row space-x-2 p-2", className)}>
      <div className="inline-flex flex-grow items-center space-x-2">
        <div className="min-w-fit">{mod.name}</div>
        <div className="min-w-fit text-xs text-gray-500">{mod.workshopId}</div>
        <div className="min-w-[12vw] text-center text-xs text-gray-500">
          {downloadProgress !== null
            ? formatBytes(downloadedBytes) + "/" + formatBytes(totalBytes)
            : " "}
        </div>
        {downloadProgress !== null && <Progress value={downloadProgress} />}
      </div>
      <div className="flex flex-row space-x-2 pr-2" />
    </div>
  )
}
