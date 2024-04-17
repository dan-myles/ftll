import { useRouterState } from "@tanstack/react-router"
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
              <a
                href="/"
                className="text-sm font-medium transition-colors
                  hover:text-primary"
              >
                Home
              </a>
            ) : (
              <a
                href="/"
                className="text-sm font-medium text-muted-foreground
                  transition-colors hover:text-primary"
              >
                Home
              </a>
            )}
            {path === "/server-browser" ? (
              <a
                href="/server-browser"
                className="text-sm font-medium transition-colors
                  hover:text-primary"
              >
                Server Browser
              </a>
            ) : (
              <a
                href="/server-browser"
                className="text-sm font-medium text-muted-foreground
                  transition-colors hover:text-primary"
              >
                Server Browser
              </a>
            )}
            {path === "/mod-manager" ? (
              <a
                href="/settings"
                className="text-sm font-medium transition-colors
                  hover:text-primary"
              >
                Mods
              </a>
            ) : (
              <a
                href="/mod-manager"
                className="text-sm font-medium text-muted-foreground
                  transition-colors hover:text-primary"
              >
                Mods
              </a>
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}
