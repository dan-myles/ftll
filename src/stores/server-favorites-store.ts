import type { Server, ServerList } from "@/app/browser/data/server-schema"
import { del, get, set } from "idb-keyval"
import { create } from "zustand"
import { StateStorage, createJSONStorage, persist } from "zustand/middleware"

interface ServerFavoritesState {
  serverList: ServerList
}

interface ServerFavoritesActions {
  setServerList: (serverList: ServerList) => void
  updateServer: (server: Server) => void
  removeServer: (server: Server) => void
}

const serverStorage: StateStorage = {
  getItem: async (name) => {
    const value = await get(name)
    return value || null
  },
  setItem: async (name, value) => {
    await set(name, value)
  },
  removeItem: async (name) => {
    await del(name)
  },
}

const useServerListStore = create<
  ServerFavoritesState & ServerFavoritesActions
>()(
  persist(
    (set) => ({
      serverList: [],
      setServerList: (newServerList) => {
        set({ serverList: newServerList })
      },
      updateServer: (server) => {
        set((state) => {
          const serverList = [...state.serverList]
          serverList[serverList.findIndex((s) => s.addr === server.addr)] =
            server
          return { serverList }
        })
      },
      removeServer: (server) => {
        set((state) => {
          const serverList = state.serverList.filter(
            (s) => s.addr !== server.addr
          )
          return { serverList }
        })
      },
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => serverStorage),
      skipHydration: true,
    }
  )
)

export { useServerListStore }
