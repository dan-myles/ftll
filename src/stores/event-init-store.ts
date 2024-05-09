import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface EventInitState {
  isEventsRegistered: boolean
}

interface EventInitActions {
  setIsEventsRegistered: (registered: boolean) => void
}

export const useEventInitStore = create<EventInitState & EventInitActions>()(
  persist(
    (set) => ({
      isEventsRegistered: false,
      setIsEventsRegistered: (registered) =>
        set({ isEventsRegistered: registered }),
    }),
    {
      name: "event-init-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
