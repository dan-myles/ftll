import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons"
import { type Row } from "@tanstack/react-table"
import { useFavoriteServer } from "@/hooks/useFavoriteServer"
import { serverSchema } from "@/schemas/server-schema"

interface FavrotieViewProps<TData> {
  row: Row<TData>
}

export function FavoriteView<TData>({ row }: FavrotieViewProps<TData>) {
  const server = serverSchema.parse(row.original)
  const { isFavorite, handleFavorited } = useFavoriteServer(server)

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
