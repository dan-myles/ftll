import { useEffect, useState } from "react"
import { useRouterState } from "@tanstack/react-router"
import { WindowTitlebar } from "@/components/window-controls"
import { Logo } from "./logo"
import { PlayerCountBadge } from "./player-count-badge"

export function TitleBar() {
  const path = useRouterState().location.pathname
  const [title, setTitle] = useState(() => {
    if (path === "/") {
      return "Home"
    }

    if (path === "/server-browser") {
      return "Server Browser"
    }

    if (path === "/mod-manager") {
      return "Mod Manager"
    }

    if (path === "/settings") {
      return "Settings"
    }
  })

  useEffect(() => {
    if (path === "/") {
      setTitle("Home")
    }

    if (path === "/server-browser") {
      setTitle("Server Browser")
    }

    if (path === "/mod-manager") {
      setTitle("Mod Manager")
    }

    if (path === "/settings") {
      setTitle("Settings")
    }
  }, [path])

  return (
    <div className="flex h-10 justify-between">
      {/* Transparent BG Logo ~ left side */}
      <div
        className="inline-flex w-[52px] justify-center bg-transparent p-2
          text-white dark:text-indigo-400"
      >
        <div className="self-center pl-2 pr-2">
          <Logo height={15} />
        </div>
      </div>

      {/* Window Controls ~ right side */}
      <WindowTitlebar controlsOrder="right" className="flex-grow bg-background">
        <div
          className="flex flex-grow flex-row justify-between"
          data-tauri-drag-region
        >
          <div
            className="flex flex-col justify-center pl-4 text-xl font-semibold"
          >
            {title}
          </div>
          <div className="flex flex-col justify-center pr-4">
            {path === "/" && <PlayerCountBadge />}
          </div>
        </div>
      </WindowTitlebar>
    </div>
  )
}
