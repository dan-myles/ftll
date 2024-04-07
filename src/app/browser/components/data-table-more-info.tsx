import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { BMGraphRes, bmGraphResSchema } from "@/validators/bm-graph-res-schema"
import { useQuery } from "@tanstack/react-query"
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
  const { data, isSuccess } = useQuery({
    queryKey: ["bm-graph", server.name],
    queryFn: fetchGraphData,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })

  if (!isSuccess) {
    return null
  }

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

async function fetchGraphData({ queryKey }: { queryKey: string[] }) {
  // Fetch for server id
  const res = await fetch(
    "https://api.battlemetrics.com/" +
      "servers?fields%5Bserver%5D=rank%2Cname" +
      "%2Cplayers%2CmaxPlayers%2Caddress%2Cip%2Cport" +
      "%2Ccountry%2Clocation%2Cdetails%2Cstatus&relations" +
      "%5Bserver%5D=game%2CserverGroup&filter%5Bsearch%5D=" +
      queryKey.at(1)
  )
  if (!res) {
    return Promise.reject(new Error("Failed to search server"))
  }
  const data = await res.json()

  // get iso string time of now to 30 days ago
  const now = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(now.getDate() - 30)
  // Fetch for graph data
  const graphRes = await fetch(
    "https://api.battlemetrics.com/servers/" +
      data.data[0].id +
      "/rank-history?start=" +
      thirtyDaysAgo.toISOString() +
      "&stop=" +
      now.toISOString()
  )
  console.log(graphRes)
  const data2 = await graphRes.json()
  const graphData = bmGraphResSchema.safeParse(data2)
  if (!graphData.success) {
    return Promise.reject(new Error("Failed to fetch graph data"))
  }
  return data2 as BMGraphRes
}
