"use client"

import { FTLLContextProvider } from "@/components/ftll-context-provider"
import { MainNav } from "@/components/main-nav"
import { ScreenIndicator } from "@/components/screen-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { TitleBar } from "@/components/title-bar"
import { cn } from "@/lib/utils"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [queryClient] = useState<QueryClient>(() => new QueryClient())

  return (
    <html lang="en" className="h-screen overflow-clip" suppressHydrationWarning>
      <body className="overflow-clip font-sans antialiased scrollbar-none">
        <ThemeProvider
          themes={["light", "dark", "system"]}
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <FTLLContextProvider />
          <QueryClientProvider client={queryClient}>
            <main className="h-screen overflow-clip">
              <TitleBar />
              <MainNav />
              <div
                className={cn(
                  // This is the main content area
                  // It should take up the remaining space - 125px for header
                  "h-[calc(100vh-125px)] overflow-auto",
                  "scrollbar-thumb-rounded-md scrollbar scrollbar-track-transparent scrollbar-thumb-accent"
                )}
              >
                {children}
              </div>
            </main>
          </QueryClientProvider>
        </ThemeProvider>
        <ScreenIndicator />
      </body>
    </html>
  )
}
