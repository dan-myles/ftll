"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserNav } from "./user-nav"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const path = usePathname()

  return (
    <div
      className="
      flex-1 flex-col space-y-8 bg-background pl-4 pr-4 pt-4 
      shadow-2xl shadow-black md:flex"
    >
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <UserNav />
          <nav
            className={cn(
              "flex items-center space-x-4 lg:space-x-6",
              className
            )}
            {...props}
          >
            {path === "/" ? (
              <Link
                href="/"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Home
              </Link>
            ) : (
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground 
                  transition-colors hover:text-primary"
              >
                Home
              </Link>
            )}
            {path === "/browser" ? (
              <Link
                href="/browser"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Server Browser
              </Link>
            ) : (
              <Link
                href="/browser"
                className="text-sm font-medium text-muted-foreground 
                  transition-colors hover:text-primary"
              >
                Server Browser
              </Link>
            )}
            {path === "/mod-manager" ? (
              <Link
                href="/settings"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Mods
              </Link>
            ) : (
              <Link
                href="/mod-manager"
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
