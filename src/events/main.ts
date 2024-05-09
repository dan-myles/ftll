import { listen as e1 } from "./active-download-progress"

export function registerListeners() {
  e1().catch(console.error)
}
