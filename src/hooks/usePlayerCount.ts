import { useQuery } from "@tanstack/react-query"
import { invoke } from "@tauri-apps/api/core"
import { type PlayerCount } from "@/schemas/steam/player-count-schema"

export function usePlayerCount() {
  const res = useQuery({
    queryKey: ["dayz-player-count"],
    queryFn: fetchPlayerCount,
  })

  return res
}

async function fetchPlayerCount() {
  const response = await invoke<string>("fetch", {
    uri: "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=221100",
  }).catch((e) => {
    return Promise.reject(new Error("Failed to fetch player count: " + e))
  })

  return JSON.parse(response) as PlayerCount
}
