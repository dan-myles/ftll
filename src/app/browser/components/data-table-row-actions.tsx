import { DrawerContext } from "@/components/stateful-table-row"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFavoriteServer } from "@/hooks/useFavoriteServer"
import { Server } from "@/validators/ftla/server-schema"
import {
  DotsHorizontalIcon,
  HeartFilledIcon,
  HeartIcon,
} from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { CopyIcon, InfoIcon } from "lucide-react"
import { useContext } from "react"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const handleDrawerOpen = useContext(DrawerContext)
  const { isFavorite, handleFavorited } = useFavoriteServer(
    row.original as Server
  )

  const handleCopy = () => {
    const server = row.original as Server
    const addr = server.addr.split(":")[0]
    navigator.clipboard.writeText(addr + ":" + server.gamePort)
  }

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
