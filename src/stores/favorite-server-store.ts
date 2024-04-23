import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { Server, ServerList } from "@/schemas/server-schema"

interface FavoriteServerState {
  serverList: ServerList
}

interface FavoriteServerActions {
  setServerList: (serverList: ServerList) => void
  updateServer: (server: Server) => void
  removeServer: (server: Server) => void
  addServer: (server: Server) => void
}

export const useFavoriteServerStore = create<
  FavoriteServerState & FavoriteServerActions
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
          const index = serverList.findIndex((s) => s.addr === server.addr)
          if (index !== -1) {
            serverList[index] = server
          }
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
      addServer: (server) => {
        set((state) => {
          const serverList = [...state.serverList, server]
          return { serverList }
        })
      },
    }),
    {
      name: "favorites-storage", // Unique key for local storage
      storage: createJSONStorage(() => localStorage),
    }
  )
)
