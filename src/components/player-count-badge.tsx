import { usePlayerCount } from "@/hooks/usePlayerCount"
import { cn } from "@/lib/utils"
import { Badge } from "./ui/badge"

export function PlayerCountBadge({ className }: { className?: string }) {
  const { data } = usePlayerCount()
  return (
    <div className={cn(className, "space-x-2")}>
      <Badge variant="secondary">Players Online</Badge>
      <Badge variant="outline">{data?.response.player_count}</Badge>
    </div>
  )
}
