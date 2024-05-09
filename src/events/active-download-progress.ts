import { useModDownloadQueue } from "@/stores/mod-download-queue"
import { events } from "@/tauri-bindings"

// Listen for Active Download Progress
// So we can update the download queue
export function listen() {
  events.activeDownloadProgressEvent
    .listen((event) => {
      console.log({ event })

      if (event.payload.percentage_downloaded === "100.0") {
        useModDownloadQueue
          .getState()
          .removeMod(event.payload.published_file_id)
          .catch(console.error)
      }
    })
    .catch(console.error)
}
