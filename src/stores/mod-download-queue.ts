import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { invoke } from "@tauri-apps/api/core"
import { type Mod } from "@/schemas/server-schema"

interface ModDownloadQueueState {
  downloadQueue: Mod[]
}

interface ModDownloadQueueActions {
  pushFix: (mod: Mod, force: boolean) => Promise<void>
  pushMod: (mod: Mod) => Promise<void>
  removeMod: (workshopId: number) => void
  clearQueue: () => void
}

export const useModDownloadQueue = create<
  ModDownloadQueueState & ModDownloadQueueActions
>()(
  persist(
    (set) => ({
      downloadQueue: [],
      pushFix: async (mod, force) => {
        if (!force) {
          await invoke("steam_fix_mod", {
            publishedFileId: mod.workshopId,
          }).catch(console.error)
          return Promise.resolve()
        }

        await invoke("steam_fix_mod_forcefully", {
          publishedFileId: mod.workshopId,
        }).catch(console.error)

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
      // This does not remove the mods from the queue, just clears the UI representation
      clearQueue: () => set({ downloadQueue: [] }),
    }),
    {
      name: "queue-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
