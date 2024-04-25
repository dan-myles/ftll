import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { type ModInfo } from "@/schemas/mod-info"

interface ModDownloadQueueState {
  downloadQueue: ModInfo[]
}

interface ModDownloadQueueActions {
  popMod: () => void
  pushMod: (mod: ModInfo) => void
  removeMod: (id: number) => void
}

export const useModDownloadQueue = create<
  ModDownloadQueueState & ModDownloadQueueActions
>()(
  persist(
    (set) => ({
      downloadQueue: [],
      popMod: () => {
        set((state) => {
          return {
            downloadQueue: state.downloadQueue.slice(1),
          }
        })
      },
      pushMod: (mod) => {
        set((state) => {
          if (
            state.downloadQueue.some(
              (m) => m.published_file_id === mod.published_file_id
            )
          ) {
            return state
          }

          return {
            downloadQueue: [...state.downloadQueue, mod],
          }
        })
      },
      removeMod: (id) => {
        set((state) => {
          return {
            downloadQueue: state.downloadQueue.filter(
              (m) => m.published_file_id !== id
            ),
          }
        })
      },
    }),
    {
      name: "mod-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
