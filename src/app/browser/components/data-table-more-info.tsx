import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useServerRankGraphData } from "@/hooks/useServerRankGraphData"
import { Row } from "@tanstack/react-table"
import { serverSchema } from "../data/server-schema"
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
  const { data } = useServerRankGraphData(server.name)

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
            <RankChart data={data} />
          </div>
          <DrawerFooter>{server.steamId}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
