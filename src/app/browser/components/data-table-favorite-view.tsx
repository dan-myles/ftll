import { useFavoriteServer } from "@/hooks/useFavoriteServer"
import { Server } from "@/validators/ftla/server-schema"
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

interface DataTableFavoriteView<TData> {
  row: Row<TData>
}

export function DataTableFavoriteView<TData>({
  row,
}: DataTableFavoriteView<TData>) {
  const { isFavorite, handleFavorited } = useFavoriteServer(
    row.original as Server
  )

  return (
    <div className="">
      {!isFavorite && (
        <div
          onClick={handleFavorited}
          className="max-w-fit cursor-pointer rounded-md p-2 hover:bg-accent"
        >
          <HeartIcon className="h-4 w-4" />
        </div>
      )}
      {isFavorite && (
        <div
          onClick={handleFavorited}
          className="max-w-fit cursor-pointer rounded-md p-2 hover:bg-accent"
        >
          <HeartFilledIcon className="h-4 w-4 text-red-500" />
        </div>
      )}
    </div>
  )
}
