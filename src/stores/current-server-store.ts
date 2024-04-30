import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { Server } from "@/schemas/server-schema"

interface CurrentServerState {
  server: Server | undefined
}

interface CurrentServerActions {
  setServer: (server: Server) => void
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
