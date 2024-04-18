import { useEffect, useState } from "react"
import { useNavigate, useRouterState } from "@tanstack/react-router"
import { WindowTitlebar } from "@/components/window-controls"

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
  }, [path])

  return (
    <div className="flex h-10 justify-between">
      {/* Transparent Logo ~ left side */}
      <div
        className="inline-flex w-[52px] justify-center bg-transparent p-2
          text-white dark:text-indigo-400"
      >
        <div className="text-md h-fit self-center pl-2 pr-2 font-bold text-white">
          FTLL
        </div>
      </div>

      {/* Window Controls ~ right side */}
      <WindowTitlebar controlsOrder="right" className="flex-grow bg-background">
        <div className="pl-6 pt-[12px] text-xl font-semibold">{title}</div>
      </WindowTitlebar>
    </div>
  )
}
