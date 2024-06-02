import { toast } from "sonner"
import { useCurrentServerStore } from "@/stores/current-server-store"
import { events } from "@/tauri-bindings"

// Listen for DayZ Shutdown
// So we can clear the server info from current-server-store
export function listen() {
  events.dayzShutdownEvent
    .listen(() => {
      console.log("DayZ has shutdown!")

      toast.info("DayZ has shutdown!", {
        position: "bottom-center",
      })
      useCurrentServerStore.getState().clearServer()
    })
    .catch(console.error)
}
