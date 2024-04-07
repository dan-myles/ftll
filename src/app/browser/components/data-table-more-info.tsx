import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { BMGraphRes, bmGraphResSchema } from "@/validators/bm-graph-res-schema"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Row } from "@tanstack/react-table"
import { serverSchema } from "../data/server-schema"

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
  const queryClient = useQueryClient()

  // This is horribly ugly
  const { data, isSuccess } = useQuery({
    queryKey: ["bm-graph", server.name],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(
        "https://api.battlemetrics.com/servers?fields%5Bserver%5D=rank%2Cname%2Cplayers%2CmaxPlayers%2Caddress%2Cip%2Cport%2Ccountry%2Clocation%2Cdetails%2Cstatus&relations%5Bserver%5D=game%2CserverGroup&filter%5Bsearch%5D=" +
          queryKey.at(1)
      )
      console.log("JUST FETCHED")
      if (!res) {
        return Promise.reject(new Error("Failed to search server"))
      }
      const data = await res.json()

      const res2 = await fetch(
        "https://api.battlemetrics.com/servers/" +
          data.data[0].id +
          "/rank-history?start=2024-02-27T00%3A00%3A00.000Z&stop=2024-03-28T00%3A00%3A00.000Z"
      )
      const data2 = await res2.json()
      const graphData = bmGraphResSchema.safeParse(data2)
      if (!graphData.success) {
        return Promise.reject(new Error("Failed to fetch graph data"))
      }
      return data2 as BMGraphRes
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  })

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
          <DrawerFooter>{server.steamId}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
