import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

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

export const useUserInfoStore = create<UserInfoState & UserInfoActions>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
