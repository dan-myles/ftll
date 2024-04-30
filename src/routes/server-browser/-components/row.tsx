import { createContext, useState } from "react"
import { type Row } from "@tanstack/react-table"
import { MoreInfo } from "@/components/more-info"
import { useUpdateServer } from "@/hooks/useUpdateServer"
import { cn } from "@/lib/utils"
import { type Server, serverSchema } from "@/schemas/server-schema"

export const UpdatedServerContext = createContext<Server | undefined>(undefined)
export const DrawerContext = createContext<() => void>(() => {
  return
})

interface RowProps<TData> extends React.HTMLAttributes<HTMLTableRowElement> {
  row: Row<TData>
  className?: string
}

export function TableRow<TData>({ className, row, ...props }: RowProps<TData>) {
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const handleOpenDrawer = () => setDrawerOpen(true)
  const handleCloseDrawer = () => setDrawerOpen(false)
  const server = serverSchema.parse(row.original)
  const update = useUpdateServer(server)

  return (
    <UpdatedServerContext.Provider value={update}>
      <DrawerContext.Provider value={handleOpenDrawer}>
        <tr
          className={cn(
            `select-none border-b transition-colors hover:bg-muted/50
            data-[state=selected]:bg-muted`,
            className
          )}
          onDoubleClickCapture={() => handleOpenDrawer()}
          {...props}
        ></tr>
        <MoreInfo
          initServer={row.original as Server}
          open={isDrawerOpen}
          onClose={handleCloseDrawer}
        />
      </DrawerContext.Provider>
    </UpdatedServerContext.Provider>
  )
}
