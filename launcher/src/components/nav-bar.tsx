import { type ReactNode } from "react"
import { Link, useMatchRoute } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { Route as IndexRoute } from "@/routes/index"
import { Route as ModManagerRoute } from "@/routes/mod-manager/index"
import { Route as ServerBrowserRoute } from "@/routes/server-browser/index"
import { Button } from "./ui/button"
import { UserButton } from "./user-button"

export function NavBar() {
  return (
    <div
      className="h-[81px] flex-1 flex-col space-y-8 bg-background pl-4 pr-4 pt-4
        shadow-black md:flex"
    >
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <UserButton />
          <nav className="flex items-center">
            <NavLink to={IndexRoute.to}>Home</NavLink>
            <NavLink to={ServerBrowserRoute.to}>Server Browser</NavLink>
            <NavLink to={ModManagerRoute.to}>Mod Manager</NavLink>
          </nav>
        </div>
      </div>
    </div>
  )
}

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  const matchRoute = useMatchRoute()
  const isMatch = matchRoute({ to: to })

  return (
    <Link to={to} className="text-sm font-medium transition-colors">
      <Button
        variant="ghost"
        className={cn(
          isMatch
            ? "text-black dark:text-indigo-400"
            : `text-neutral-400 hover:text-black dark:text-neutral-600
              dark:hover:text-accent-foreground`
        )}
      >
        {children}
      </Button>
    </Link>
  )
}
