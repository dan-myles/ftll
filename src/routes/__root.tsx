import { useEffect } from "react"
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { persistQueryClient } from "@tanstack/react-query-persist-client"
import { Outlet, createRootRoute } from "@tanstack/react-router"
import { FTLLContextProvider } from "@/components/ftll-context-provider"
import { ScreenIndicator } from "@/components/screen-indicator"
import { SideNav } from "@/components/side-nav"
import { TanStackRouterDevtools } from "@/components/tanstack-router-devtools"
import { ThemeProvider } from "@/components/theme-provider"
import { TitleBar } from "@/components/title-bar"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

// This is the root for our app, however this is not near <html>
// and starts at a <div> with id "root", html styles are in index.html
export const Route = createRootRoute({
  component: Root,
})

function Root() {
  // Query client for fetching data
  // Mainly for BM & Steam
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        gcTime: 1000 /*Ms*/ * 60 /*Secs*/ * 60 /*Mins*/ * 24 /*Hours*/,
      },
    },
  })

  // Persist the query client to localStorage
  useEffect(() => {
    const localStoragePersister = createSyncStoragePersister({
      storage: window.localStorage,
    })

    void persistQueryClient({
      queryClient: client,
      persister: localStoragePersister,
    })
  })

  return (
    <>
      <QueryClientProvider client={client}>
        <ThemeProvider
          themes={["light", "dark", "system"]}
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <FTLLContextProvider>
            <TooltipProvider>
              <TitleBar />
              <main
                // 100vh - 40px for titlebar
                className="flex h-[calc(100vh-40px)]"
              >
                <SideNav />
                <div className="flex-grow bg-background">
                  <Outlet />
                </div>
              </main>
              <Toaster />
              <ScreenIndicator open />
              <TanStackRouterDevtools position="bottom-right" />
            </TooltipProvider>
          </FTLLContextProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  )
}
