import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons"
import { type Row } from "@tanstack/react-table"
import { useFavoriteServer } from "@/hooks/useFavoriteServer"
import { type Server32 } from "@/tauri-bindings"

interface FavrotieViewProps<TData> {
  row: Row<TData>
}

export function FavoriteView<TData>({ row }: FavrotieViewProps<TData>) {
  const { isFavorite, handleFavorited } = useFavoriteServer(
    row.original as Server32
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
