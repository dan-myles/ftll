import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { type Mod32 } from "@/tauri-bindings"
import { commands } from "@/tauri-bindings"

interface ModDownloadQueueState {
  downloadQueue: Mod32[]
}

interface ModDownloadQueueActions {
  pushFix: (mod: Mod32, force: boolean) => Promise<void>
  pushMod: (mod: Mod32) => Promise<void>
  removeMod: (workshopId: string) => void
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
          await commands.steamFixMod(mod.workshop_id).catch(console.error)
          return Promise.resolve()
        }

        await commands
          .steamFixModForcefully(mod.workshop_id)
          .catch(console.error)

        set((state) => {
          if (
            state.downloadQueue.some((m) => m.workshop_id === mod.workshop_id)
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
        commands.mdqAddMod(mod.workshop_id).catch((e) => {
          return Promise.reject(e)
        })

        set((state) => {
          if (
            state.downloadQueue.some((m) => m.workshop_id === mod.workshop_id)
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
              (m) => m.workshop_id !== workshopId
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
