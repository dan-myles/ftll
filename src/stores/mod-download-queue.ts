import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { invoke } from "@tauri-apps/api/core"
import { type Mod } from "@/schemas/server-schema"

interface ModDownloadQueueState {
  downloadQueue: Mod[]
}

interface ModDownloadQueueActions {
  popMod: () => Mod | undefined
  pushMod: (mod: Mod) => void
  removeMod: (workshopId: number) => void
  clearQueue: () => void
}

export const useModDownloadQueue = create<
  ModDownloadQueueState & ModDownloadQueueActions
>()(
  persist(
    (set) => ({
      downloadQueue: [],
      popMod: () => {
        let mod = undefined
        set((state) => {
          mod = state.downloadQueue.shift()
          return {
            downloadQueue: state.downloadQueue,
          }
        })
        return mod
      },
      pushMod: (mod) => {
        set((state) => {
          if (
            state.downloadQueue.some((m) => m.workshopId === mod.workshopId)
          ) {
            return state
          }

          // invoke("download_mod", { publishedFileId: mod.workshopId }).catch(
          //   console.error
          // )

          return {
            downloadQueue: [...state.downloadQueue, mod],
          }
        })
      },
      removeMod: (workshopId) => {
        set((state) => {
          return {
            downloadQueue: state.downloadQueue.filter(
              (m) => m.workshopId !== workshopId
            ),
          }
        })
      },
      clearQueue: () => set({ downloadQueue: [] }),
    }),
    {
      name: "mod-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
