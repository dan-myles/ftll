import { useTheme } from "next-themes"
import { useCallback, useEffect, useRef, useState } from "react"
import { Avatar } from "@radix-ui/react-avatar"
import { LaptopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserInfoStore } from "@/stores/user-info-store"
import { AboutDialog } from "./about-dialog"
import { Dialog } from "./ui/dialog"

export function UserButton() {
  const { setTheme, theme } = useTheme()
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const user = useUserInfoStore((state) => state.user)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleAboutChange = (isOpen: boolean) => setIsAboutOpen(isOpen)

  const open = useCallback(async (url: string) => {
    const { open } = await import("@tauri-apps/plugin-shell")
    void open?.(url)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")

    const loadAvi = () => {
      if (!user.avi) {
        return
      }
      const imageData = new ImageData(new Uint8ClampedArray(user.avi), 64, 64)
      context?.putImageData(imageData, 0, 0)
    }

    loadAvi()
  })

  return (
    <>
      <DropdownMenu modal={true}>
        <DropdownMenuTrigger className="flex items-center justify-center">
          <Avatar>
            <canvas
              className="mt-1 h-8 w-8"
              height="64"
              width="64"
              ref={canvasRef}
            ></canvas>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start" forceMount>
          <DropdownMenuItem onClick={() => setIsAboutOpen(true)}>
            About FTLL
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {theme === "light" ? (
                    <DropdownMenuItem
                      className="bg-accent"
                      onClick={() => setTheme("light")}
                    >
                      <SunIcon className="mr-2 h-4 w-4" />
                      Light
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <SunIcon className="mr-2 h-4 w-4" />
                      Light
                    </DropdownMenuItem>
                  )}
                  {theme === "dark" ? (
                    <DropdownMenuItem
                      className="bg-accent"
                      onClick={() => setTheme("dark")}
                    >
                      <MoonIcon className="mr-2 h-4 w-4" />
                      Dark
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <MoonIcon className="mr-2 h-4 w-4" />
                      Dark
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {theme === "system" ? (
                    <DropdownMenuItem
                      className="bg-accent"
                      onClick={() => setTheme("system")}
                    >
                      <LaptopIcon className="mr-2 h-4 w-4" />
                      System
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      <LaptopIcon className="mr-2 h-4 w-4" />
                      System
                    </DropdownMenuItem>
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem
              onClick={() => {
                void open("https://steamcommunity.com/profiles/" + user.steamId)
              }}
            >
              Profile
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-[10px] leading-none text-muted-foreground">
                {user.steamId}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isAboutOpen} onOpenChange={handleAboutChange}>
        <AboutDialog />
      </Dialog>
    </>
  )
}
