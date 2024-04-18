import { Link, useRouterState } from "@tanstack/react-router"
import { Route as IndexRoute } from "@/routes/index"
import { Route as ModManagerRoute } from "@/routes/mod-manager/index"
import { Route as ServerBrowserRoute } from "@/routes/server-browser/index"
import { UserButton } from "./user-button"

export function NavBar() {
  const path = useRouterState().location.pathname

  return (
    <div
      className="h-[81px] flex-1 flex-col space-y-8 rounded-t-3xl bg-background
        pl-4 pr-4 pt-4 shadow-black md:flex"
    >
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <UserButton />
          <nav className="flex items-center space-x-4 lg:space-x-6">
            {path === "/" ? (
              <Link
                to={IndexRoute.to}
                className="text-sm font-medium transition-colors
                  hover:text-primary"
              >
                Home
              </Link>
            ) : (
              <Link
                to={IndexRoute.to}
                className="text-sm font-medium text-muted-foreground
                  transition-colors hover:text-primary"
              >
                Home
              </Link>
            )}
            {path === "/server-browser" ? (
              <Link
                to={ServerBrowserRoute.to}
                className="text-sm font-medium transition-colors
                  hover:text-primary"
              >
                Server Browser
              </Link>
            ) : (
              <Link
                to={ServerBrowserRoute.to}
                className="text-sm font-medium text-muted-foreground
                  transition-colors hover:text-primary"
              >
                Server Browser
              </Link>
            )}
            {path === "/mod-manager" ? (
              <Link
                to={ModManagerRoute.to}
                className="text-sm font-medium transition-colors
                  hover:text-primary"
              >
                Mods
              </Link>
            ) : (
              <Link
                to={ModManagerRoute.to}
                className="text-sm font-medium text-muted-foreground
                  transition-colors hover:text-primary"
              >
                Mods
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}
