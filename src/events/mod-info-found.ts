import { useModListStore } from "@/stores/mod-list-store"
import { events } from "@/tauri-bindings"

// Listen for Installed Mods
// Due to how the Steamworks API works
// We can't cant request the list and await a response
// We have to listen for a callback event instead
export function listen() {
  events.modInfoFoundEvent
    .listen((event) => {
      useModListStore.getState().addMod(event.payload)
    })
    .catch(console.error)
}
