import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { Server32 } from "@/tauri-bindings"

interface CurrentServerState {
  server: Server32 | undefined
}

interface CurrentServerActions {
  setServer: (server: Server32) => void
  clearServer: () => void
}

export const useCurrentServerStore = create<
  CurrentServerState & CurrentServerActions
>()(
  persist(
    (set) => ({
      server: undefined,
      setServer: (server) => set({ server: server }),
      clearServer: () => set({ server: undefined }),
    }),
    {
      name: "current-server-storage", // Unique key for local storage
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
