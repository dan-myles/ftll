import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { type Server32 } from "@/tauri-bindings"

interface ConnectedServerState {
  connectedServer: Server32 | undefined
}

interface ConnectedServerActions {
  setConnectedServer: (server: Server32) => void
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
