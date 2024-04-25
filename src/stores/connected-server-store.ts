import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { Server } from "@/schemas/server-schema"

interface ConnectedServerState {
  connectedServer: Server | undefined
}

interface ConnectedServerActions {
  setConnectedServer: (server: Server) => void
  clearConnectedServer: () => void
}

export const useConnectedServer = create<
  ConnectedServerState & ConnectedServerActions
>()(
  persist(
    (set) => ({
      connectedServer: undefined,
      setConnectedServer: (server) => {
        set({ connectedServer: server })
      },
      clearConnectedServer: () => {
        set({ connectedServer: undefined })
      },
    }),
    {
      name: "connected-server-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
