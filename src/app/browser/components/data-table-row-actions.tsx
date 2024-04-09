import { DrawerContext } from "@/components/stateful-table-row"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFavoriteServerStore } from "@/stores/favorite-server-store"
import { Server } from "@/validators/ftla/server-schema"
import {
  DotsHorizontalIcon,
  HeartFilledIcon,
  HeartIcon,
} from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { CopyIcon, InfoIcon } from "lucide-react"
import { useContext, useEffect, useState } from "react"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { addServer, removeServer, serverList } = useFavoriteServerStore()
  const [isFavorite, setFavorite] = useState(false)
  const handleDrawerOpen = useContext(DrawerContext)

  const handleCopy = () => {
    const server = row.original as Server
    const addr = server.addr.split(":")[0]
    navigator.clipboard.writeText(addr + ":" + server.gamePort)
  }

  const handleFavorited = () => {
    const server = row.original as Server
    if (isFavorite) {
      setFavorite(false)
      removeServer(server)
    } else {
      setFavorite(true)
      addServer(server)
    }
  }

  useEffect(() => {
    const server = row.original as Server
    const isFavorited = serverList.some((s: Server) => s.addr === server.addr)
    setFavorite(isFavorited)
  }, [serverList, row])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleFavorited}>
            {isFavorite && (
              <>
                <HeartFilledIcon className="mr-2 h-4 w-4 text-red-500" />
                Unfavorite
              </>
            )}
            {!isFavorite && (
              <>
                <HeartIcon className="mr-2 h-4 w-4" />
                Favorite
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopy}>
            <CopyIcon className="mr-2 h-4 w-4" />
            Copy
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDrawerOpen}>
            <InfoIcon className="mr-2 h-4 w-4" />
            More Info
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
