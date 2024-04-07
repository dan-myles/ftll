import { PlayerCount } from "@/validators/steam/player-count"
import { useQuery } from "@tanstack/react-query"
import { invoke } from "@tauri-apps/api/core"

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
  })

  if (response === "") {
    return Promise.reject(new Error("Failed to fetch player count"))
  }

  return JSON.parse(response) as PlayerCount
}
