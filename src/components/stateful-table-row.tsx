"use client"

import DataTableMoreInfo from "@/app/browser/components/data-table-more-info"
import { Server } from "@/app/browser/data/server-schema"
import { cn } from "@/lib/utils"
import { invoke } from "@tauri-apps/api/core"
import { createContext, useEffect, useState } from "react"

export const UpdatedServerContext = createContext<Server | undefined>(undefined)

export function StatefulTableRow({
  className,
  row,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { row?: any }) {
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [server, setServer] = useState<Server>()
  const handleOpenDrawer = () => setDrawerOpen(true)
  const handleCloseDrawer = () => setDrawerOpen(false)

  // Normally we would use react-query here, but the ping changes so often
  // that we can't take advantage of the caching feature. The cache is stored
  // in localStorage, so we have a limit of 5MB. This is not enough for our use.
  useEffect(() => {
    const update = async () => {
      const updatedServer = await invoke<Server>("get_server_info", {
        server: row.original,
      })
      setServer(updatedServer)
    }

    let delayBeforeUpdate: NodeJS.Timeout
    let intervalToUpdate: NodeJS.Timeout

    delayBeforeUpdate = setTimeout(
      () => {
        intervalToUpdate = setInterval(() => {
          update()
        }, 3750)
      },
      Math.random() * 5000 + 3000
    )

    return () => {
      invoke("destroy_server_info_semaphore")
      clearTimeout(delayBeforeUpdate)
      clearInterval(intervalToUpdate)
    }
  }, [row.original])

  return (
    <>
      <UpdatedServerContext.Provider value={server}>
        <tr
          className={cn(
            "select-none border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50",
            className
          )}
          onDoubleClickCapture={() => handleOpenDrawer()}
          {...props}
        ></tr>
        <DataTableMoreInfo
          row={row}
          open={isDrawerOpen}
          onClose={handleCloseDrawer}
        />
      </UpdatedServerContext.Provider>
    </>
  )
}
