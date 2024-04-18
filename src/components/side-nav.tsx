import { Bot, Home, ListTree, Settings2 } from "lucide-react"
import { type ReactNode } from "react"
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
import { UserButton } from "./user-button"

export function SideNav() {
  return (
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
            <UserButton />
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Account
          </TooltipContent>
        </Tooltip>
      </nav>
    </aside>
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
