import { create } from "zustand"

type User = {
  name?: string
  steamId?: string
  avi?: Uint8Array
}

interface UserInfoState {
  user: User
}

interface UserInfoActions {
  setUserName: (name: string) => void
  setSteamId: (steamId: string) => void
  setAvi: (avi: Uint8Array) => void
}

const useUserInfoStore = create<UserInfoState & UserInfoActions>()((set) => ({
  user: {},
  setUserName: (name) => {
    set((state) => {
      return {
        user: {
          ...state.user,
          name,
        },
      }
    })
  },
  setSteamId: (steamId) => {
    set((state) => {
      return {
        user: {
          ...state.user,
          steamId,
        },
      }
    })
  },
  setAvi: (avi) => {
    set((state) => {
      return {
        user: {
          ...state.user,
          avi,
        },
      }
    })
  },
}))

export { useUserInfoStore }
