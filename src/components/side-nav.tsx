import {
  Bot,
  Home,
  Info,
  Library,
  ListTree,
  Moon,
  Settings2,
  Store,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"
import { type ReactNode, useState } from "react"
import { Link, useMatchRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Route as IndexRoute } from "@/routes/index"
import { Route as ModManagerRoute } from "@/routes/mod-manager/index"
import { Route as ServerBrowserRoute } from "@/routes/server-browser/index"
import { AboutDialog } from "./about-dialog"
import { Dialog } from "./ui/dialog"
import { UserToolTip } from "./user-tooltip"

export function SideNav() {
  const { theme, setTheme } = useTheme()
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const handleAboutChange = (isOpen: boolean) => setIsAboutOpen(isOpen)

  const handleThemeToggle = () => {
    if (theme === "dark") {
      setTheme("light")
    }
    if (theme === "light") {
      setTheme("dark")
    }

    if (theme === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("light")
      } else {
        setTheme("dark")
      }
    }
  }

  return (
    <>
      <aside className="flex h-full w-[52px] flex-col">
        <nav className="grid gap-1 p-2">
          <NavButton to={IndexRoute.to} aria-label="Home" hoverText="Home">
            <Home className="size-5" />
          </NavButton>
          <NavButton
            to={ServerBrowserRoute.to}
            aria-label="Server Browser"
            hoverText="Server Browser"
          >
            <ListTree className="size-5" />
          </NavButton>
          <NavButton
            to={ModManagerRoute.to}
            aria-label="Mod Manager"
            hoverText="Mod Manager"
          >
            <Bot className="size-5" />
          </NavButton>
          <NavButton to="/settings" aria-label="Settings" hoverText="Settings">
            <Settings2 className="size-5" />
          </NavButton>
        </nav>
        <nav className="mt-auto grid gap-1 p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                onClick={handleThemeToggle}
              >
                <Sun
                  className="size-5 rotate-0 scale-100 transition-all
                    dark:-rotate-90 dark:scale-0"
                />
                <Moon
                  className="absolute size-5 rotate-90 scale-0 transition-all
                    dark:rotate-0 dark:scale-100"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Theme
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                aria-label="Help"
                onClick={() => setIsAboutOpen(true)}
              >
                <Library className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              About
            </TooltipContent>
          </Tooltip>
        </nav>
        <UserToolTip />
      </aside>
      <Dialog open={isAboutOpen} onOpenChange={handleAboutChange}>
        <AboutDialog />
      </Dialog>
    </>
  )
}

function NavButton({
  to,
  children,
  hoverText,
}: {
  to?: string
  children: ReactNode
  hoverText: string
}) {
  const matchRoute = useMatchRoute()
  const isMatch = matchRoute({ to: to })

  return (
    <Tooltip>
      <Link to={to} className="rounded-lg">
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-lg", isMatch && "bg-muted")}
            aria-label="Playground"
          >
            {children}
          </Button>
        </TooltipTrigger>
      </Link>
      <TooltipContent side="right" sideOffset={5}>
        {hoverText}
      </TooltipContent>
    </Tooltip>
  )
}
