import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { type ModInfo } from "@/schemas/mod-info"

interface ModListState {
  modList: ModInfo[]
}

interface ModListActions {
  setModList: (modList: ModInfo[]) => void
  addMod: (mod: ModInfo) => void
  removeMod: (id: number) => void
}

export const useModListStore = create<ModListState & ModListActions>()(
  persist(
    (set) => ({
      modList: [],
      setModList: (modList) => {
        set(() => {
          return {
            modList,
          }
        })
      },
      addMod: (mod) => {
        set((state) => {
          if (
            state.modList.some(
              (m) => m.published_file_id === mod.published_file_id
            )
          ) {
            return state
          }

          return {
            modList: [...state.modList, mod],
          }
        })
      },
      removeMod: (id) => {
        set((state) => {
          console.log("Removing mod", id)
          return {
            modList: state.modList.filter((m) => m.published_file_id !== id),
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
