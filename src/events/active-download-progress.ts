import { useModDownloadQueue } from "@/stores/mod-download-queue"
import { events } from "@/tauri-bindings"

export async function listen() {
  await events.activeDownloadProgressEvent.listen((event) => {
    console.log(event)

    if (event.payload.percentage_downloaded === "100.0") {
      useModDownloadQueue.getState().removeMod(event.payload.published_file_id)
    }
  })
}
