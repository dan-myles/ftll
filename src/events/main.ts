import { useEventInitStore } from "@/stores/event-init-store"
import { listen as e1 } from "./active-download-progress"
import { listen as e2 } from "./dayz-shutdown"
import { listen as e3 } from "./mod-info-found"

export function registerListeners() {
  // Check if we are already listening for events
  const { isEventsRegistered, setIsEventsRegistered } =
    useEventInitStore.getState()
  if (isEventsRegistered) return

  // Listen up!
  e1()
  e2()
  e3()
  setIsEventsRegistered(true)
}
