import { Button } from "@/components/ui/button"
import Spinner from "@/components/ui/spinner"
import { invoke } from "@tauri-apps/api/core"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Row } from "@tanstack/react-table"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { serverSchema } from "../data/schema"

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

  async function sendRequest() {
    const res = await fetch(
      "https://api.battlemetrics.com/servers?fields%5Bserver%5D=rank%2Cname%2Cplayers%2CmaxPlayers%2Caddress%2Cip%2Cport%2Ccountry%2Clocation%2Cdetails%2Cstatus&relations%5Bserver%5D=game%2CserverGroup&filter%5Bsearch%5D=" +
        server.name
    )
    console.log(server.name)
    console.log("REMAING", res.headers.get("X-Rate-Limit-Remaining"))
    console.log(res)
    const data = await res.json()
    console.log(data)

    const res2 = await fetch(
      "https://api.battlemetrics.com/servers/" +
        data.data[0].id +
        "/player-count-history?start=2024-03-27T06%3A00%3A00.000Z&stop=2024-03-28T06%3A00%3A00.000Z&resolution=30"
    )
    const data2 = await res2.json()
    console.log(data2)

    const res3 = await fetch(
      "https://api.battlemetrics.com/servers/" +
        data.data[0].id +
        "/rank-history?start=2024-02-27T00%3A00%3A00.000Z&stop=2024-03-28T00%3A00%3A00.000Z"
    )
    const data3 = await res3.json()

    console.log(data3)
  }

  return (
    <>
      <Drawer open={open} onClose={onClose}>
        <DrawerContent
          className="min-h-[500px] select-all"
          onInteractOutside={onClose}
        >
          <DrawerHeader>
            <DrawerTitle>{server.name}</DrawerTitle>
            <DrawerDescription>
              {server.addr}:{server.gameport}
            </DrawerDescription>
          </DrawerHeader>
          <Button onClick={sendRequest}>send request</Button>
          <DrawerFooter>{server.steamid}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
