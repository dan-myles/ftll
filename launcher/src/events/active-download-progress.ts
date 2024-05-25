import { useModDownloadQueue } from "@/stores/mod-download-queue"
import { events } from "@/tauri-bindings"

// Listen for Active Download Progress
// This listener is to remove the mod from the download queue
// When the download is complete
export function listen() {
  events.activeDownloadProgressEvent
    .listen((event) => {
      if (event.payload.percentage_downloaded === "100") {
        useModDownloadQueue
          .getState()
          .removeMod(event.payload.published_file_id)
          .catch(console.error)
      }
    })
    .catch(console.error)
}
