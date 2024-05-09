import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { cn, formatBytes } from "@/lib/utils"
import { type Mod32, events } from "@/tauri-bindings"

interface PendingModProps {
  mod: Mod32
  className?: string
}

export function PendingMod({ mod, className }: PendingModProps) {
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null)
  const [totalBytes, setTotalBytes] = useState(0)
  const [downloadedBytes, setDownloadedBytes] = useState(0)

  useEffect(() => {
    const unlisten = events.activeDownloadProgressEvent
      .listen((e) => {
        if (e.payload.published_file_id !== mod.workshop_id) return

        setDownloadProgress(Number(e.payload.percentage_downloaded))
        setDownloadedBytes(Number(e.payload.bytes_downloaded))
        setTotalBytes(Number(e.payload.bytes_total))
      })
      .catch(console.error)

    return () => {
      unlisten.then((f) => f?.()).catch(console.error)
    }
  }, [mod.workshop_id])

  return (
    <div className={cn("flex flex-row space-x-2 p-2", className)}>
      <div className="inline-flex flex-grow items-center space-x-2">
        <div className="min-w-fit">{mod.name}</div>
        <div className="min-w-fit text-xs text-gray-500">{mod.workshop_id}</div>
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
