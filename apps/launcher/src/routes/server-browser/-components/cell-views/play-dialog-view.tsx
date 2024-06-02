import { PlayIcon } from "lucide-react"
import { type Row } from "@tanstack/react-table"
import { ServerPlayValidator } from "@/components/server-play-validator"
import { type Server32 } from "@/tauri-bindings"

interface PlayDialogViewProps<TData> {
  row: Row<TData>
}

export function PlayDialogView<TData>({ row }: PlayDialogViewProps<TData>) {
  const server = row.original as Server32

  return (
    <ServerPlayValidator server={server}>
      <div
        className=" inline-flex h-8 w-8 items-center justify-center rounded-md
          text-sm font-medium ring-offset-background transition-colors
          hover:bg-accent hover:text-accent-foreground
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-ring focus-visible:ring-offset-2
          disabled:pointer-events-none disabled:opacity-50"
      >
        <PlayIcon className="h-4 w-4" />
      </div>
    </ServerPlayValidator>
  )
}
