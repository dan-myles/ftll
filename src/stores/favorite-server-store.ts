import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { Server32 } from "@/tauri-bindings"

interface FavoriteServerState {
  serverList: Server32[]
}

interface FavoriteServerActions {
  setServerList: (serverList: Server32[]) => void
  updateServer: (server: Server32) => void
  removeServer: (server: Server32) => void
  removeServerByAddr: (addr: string) => void
  addServer: (server: Server32) => void
  updateServerList: (master: Server32[]) => void
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
      removeServerByAddr: (addr) => {
        set((state) => {
          const serverList = state.serverList.filter((s) => s.addr !== addr)
          return { serverList }
        })
      },
      addServer: (server) => {
        set((state) => {
          const serverList = [...state.serverList, server]
          return { serverList }
        })
      },
      updateServerList: (master) => {
        set((state) => {
          return {
            serverList: state.serverList.map(
              (s) => master.find((m) => m.addr === s.addr) ?? s
            ),
          }
        })
      },
    }),
    {
      name: "favorites-storage", // Unique key for local storage
      storage: createJSONStorage(() => localStorage),
    }
  )
)
