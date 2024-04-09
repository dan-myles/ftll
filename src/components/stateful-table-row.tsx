"use client"

import DataTableMoreInfo from "@/app/browser/components/data-table-more-info"
import { useUpdateServer } from "@/hooks/useUpdateServer"
import { cn } from "@/lib/utils"
import { Server, serverSchema } from "@/validators/ftla/server-schema"
import { createContext, useState } from "react"

export const UpdatedServerContext = createContext<Server | undefined>(undefined)
export const DrawerContext = createContext<() => void>(() => {})

export function StatefulTableRow({
  className,
  row,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { row?: any }) {
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const handleOpenDrawer = () => setDrawerOpen(true)
  const handleCloseDrawer = () => setDrawerOpen(false)
  const server = serverSchema.parse(row.original)
  const update = useUpdateServer(server)

  return (
    <>
      <UpdatedServerContext.Provider value={update}>
        <DrawerContext.Provider value={handleOpenDrawer}>
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
        </DrawerContext.Provider>
      </UpdatedServerContext.Provider>
    </>
  )
}
