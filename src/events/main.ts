import { listen as e1 } from "./active-download-progress"
import { listen as e2 } from "./dayz-shutdown"
import { listen as e3 } from "./mod-info-found"

export function registerListeners() {
  // Listen up!
  e1()
  e2()
  e3()
}
