import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { serverSchema } from "@/validators/ftla/server-schema"
import { Row } from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { RankChart } from "./more-info-server-rank-chart"

interface DataTableMoreInfoProps<TData> {
  open: boolean
  onClose: () => void
  row: Row<TData>
}

export default function DataTableMoreInfo<TData>({
  open,
  onClose,
  row,
}: DataTableMoreInfoProps<TData>) {
  const server = serverSchema.parse(row.original)
  const [mounted, setMounted] = useState(false)

  // Need to delay the rendering of the chart to prevent the
  // over fetching of data from BM api.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setMounted(true)
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <>
      <Drawer open={open} onClose={onClose}>
        <DrawerContent
          className="min-h-[65vh] select-all"
          onInteractOutside={onClose}
        >
          <DrawerHeader>
            <DrawerTitle>{server.name}</DrawerTitle>
            <DrawerDescription>
              {server.addr}:{server.gamePort}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            {mounted && <RankChart name={server.name} />}
          </div>
          <DrawerFooter>{server.steamId}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
