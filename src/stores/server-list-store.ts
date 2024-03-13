import { create } from "zustand"
import type { ServerList, Server } from "@/app/browser/data/schema"

interface ServerListState {
  serverList: ServerList
}

interface ServerListActions {
  setServerList: (serverList: ServerList) => void
  updateServer: (server: Server) => void
}

const useServerListStore = create<ServerListState & ServerListActions>()(
  (set) => ({
    serverList: [],
    setServerList: (newServerList) => {
      set({ serverList: newServerList })
    },
    updateServer: (server) => {
      set((state) => {
        const index = state.serverList.findIndex(
          (s) => s.steamid === server.steamid
        )

        if (index === -1) {
          return state
        }

        const newServerList = [...state.serverList]
        newServerList[index] = server
        return { serverList: newServerList }
      })
    },
  })
)

export { useServerListStore }
