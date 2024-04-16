import { del, get, set } from "idb-keyval"
import { create } from "zustand"
import {
  type StateStorage,
  createJSONStorage,
  persist,
} from "zustand/middleware"
import type { Server, ServerList } from "@/schemas/ftla/server-schema"

interface ServerListState {
  serverList: ServerList
}

interface ServerListActions {
  setServerList: (serverList: ServerList) => void
  updateServer: (server: Server) => void
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
      setServerList: (newServerList) => {
        set({ serverList: newServerList })
      },
      updateServer: (server) => {
        set((state) => {
          const serverList = [...state.serverList]
          const index = serverList.findIndex((s) => s.addr === server.addr)
          if (index !== -1) {
            serverList[index] = server
          }
          return { serverList }
        })
      },
    }),
    {
      name: "server-storage",
      storage: createJSONStorage(() => serverStorage),
      skipHydration: true,
    }
  )
)
