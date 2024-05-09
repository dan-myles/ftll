import { del, get, set } from "idb-keyval"
import { create } from "zustand"
import {
  type StateStorage,
  createJSONStorage,
  persist,
} from "zustand/middleware"
import type { Server32 } from "@/tauri-bindings"

interface ServerListState {
  serverList: Server32[]
}

interface ServerListActions {
  setServerList: (serverList: Server32[]) => void
}

const serverStorage: StateStorage = {
  getItem: async (name) => {
    // eslint-disable-next-line
    const value = await get(name)
    // eslint-disable-next-line
    return value || null
  },
  setItem: async (name, value) => {
    await set(name, value)
  },
  removeItem: async (name) => {
    await del(name)
  },
}

export const useServerListStore = create<ServerListState & ServerListActions>()(
  persist(
    (set) => ({
      serverList: [],
      setServerList: (newServerList) => set({ serverList: newServerList }),
    }),
    {
      name: "server-storage",
      storage: createJSONStorage(() => serverStorage),
      skipHydration: true,
    }
  )
)
