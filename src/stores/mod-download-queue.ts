import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { invoke } from "@tauri-apps/api/core"
import { type Mod } from "@/schemas/server-schema"

interface ModDownloadQueueState {
  downloadQueue: Mod[]
}

interface ModDownloadQueueActions {
  removeMod: (workshopId: number) => void
  pushMod: (mod: Mod) => void
}

export const useModDownloadQueue = create<
  ModDownloadQueueState & ModDownloadQueueActions
>()(
  persist(
    (set) => ({
      downloadQueue: [],
      pushMod: (mod) => {
        set((state) => {
          if (
            state.downloadQueue.some((m) => m.workshopId === mod.workshopId)
          ) {
            return state
          }

          invoke("mdq_mod_add", { publishedFileId: mod.workshopId }).catch(
            () => {
              console.error
              return state
            }
          )

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
    }),
    {
      name: "mod-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
