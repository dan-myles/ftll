"use client"

import { SteamPlayerCountRes } from "@/validators/steam-player-count-res-schema"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { invoke } from "@tauri-apps/api/core"

export default function Home() {
  const queryClient = useQueryClient()
  const { data, isSuccess } = useQuery({
    queryKey: ["dayz-player-count"],
    queryFn: async () => {
      const response = await invoke<string>("fetch", {
        uri: "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=221100",
      })

      if (response === "") {
        return Promise.reject(new Error("Failed to fetch player count"))
      }

      return JSON.parse(response) as SteamPlayerCountRes
    },
  })

  return (
    <>
      <div className="flex h-full w-full lg:flex-col"></div>
    </>
  )
}
