"use client"

import DataTableMoreInfo from "@/app/browser/components/data-table-more-info"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function StatefulTableRow({
  className,
  row,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { row?: any }) {
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const handleOpenDrawer = () => setDrawerOpen(true)
  const handleCloseDrawer = () => setDrawerOpen(false)

  return (
    <>
      <tr
        className={cn(
          "select-none border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50",
          className
        )}
        onDoubleClickCapture={() => handleOpenDrawer()}
        {...props}
      />
      <DataTableMoreInfo
        row={row}
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </>
  )
}
