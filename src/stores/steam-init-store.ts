import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface SteamState {
  isSteamReady: boolean
}

interface SteamActions {
  setIsSteamReady: (isSteamReady: boolean) => void
}

export const useSteamStore = create<SteamState & SteamActions>()(
  persist(
    (set) => ({
      isSteamReady: false,
      setIsSteamReady: (isSteamReady) => set({ isSteamReady }),
    }),
    {
      name: "queue-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
