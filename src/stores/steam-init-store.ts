import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface SteamInitState {
  isSteamReady: boolean
}

interface SteamInitActions {
  setIsSteamReady: (isSteamReady: boolean) => void
}

export const useSteamInitStore = create<SteamInitState & SteamInitActions>()(
  persist(
    (set) => ({
      isSteamReady: false,
      setIsSteamReady: (isSteamReady) => set({ isSteamReady }),
    }),
    {
      name: "steam-init-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
