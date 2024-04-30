import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { invoke } from "@tauri-apps/api/core"
import { type Mod } from "@/schemas/server-schema"

interface ModDownloadQueueState {
  downloadQueue: Mod[]
}

interface ModDownloadQueueActions {
  removeMod: (workshopId: number) => void
  pushMod: (mod: Mod) => Promise<void>
}

export const useModDownloadQueue = create<
  ModDownloadQueueState & ModDownloadQueueActions
>()(
  persist(
    (set) => ({
      downloadQueue: [],
      pushMod: async (mod) => {
        await invoke("mdq_mod_add", { publishedFileId: mod.workshopId }).catch(
          (e) => {
            return Promise.reject(e)
          }
        )

        set((state) => {
          if (
            state.downloadQueue.some((m) => m.workshopId === mod.workshopId)
          ) {
            return state
          }

          return {
            downloadQueue: [...state.downloadQueue, mod],
          }
        })

        return Promise.resolve()
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
      name: "queue-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
