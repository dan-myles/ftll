import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserInfoStore } from "@/stores/user-info-store"
import { useCallback, useEffect, useRef } from "react"

export function UserNav() {
  const user = useUserInfoStore((state) => state.user)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const open = useCallback(async (url: string) => {
    const { open } = await import("@tauri-apps/plugin-shell")
    open && open(url)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")

    if (user.avi) {
      const imageData = new ImageData(new Uint8ClampedArray(user.avi), 64, 64)
      context?.putImageData(imageData, 0, 0)
    }
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <canvas height="64" width="64" ref={canvasRef}></canvas>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-[10px] leading-none text-muted-foreground">
              {user.steamId}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              open("https://steamcommunity.com/profiles/" + user.steamId)
            }}
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Quit</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
