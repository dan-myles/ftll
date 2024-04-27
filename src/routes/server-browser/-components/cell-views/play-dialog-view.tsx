import { PlayIcon } from "lucide-react"
import { type Row } from "@tanstack/react-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { serverSchema } from "@/schemas/server-schema"

interface PlayDialogViewProps<TData> {
  row: Row<TData>
}

export function PlayDialogView<TData>({ row }: PlayDialogViewProps<TData>) {
  const server = serverSchema.parse(row.original)

  return (
    <AlertDialog>
      <AlertDialogTrigger>
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
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="max-w-[450px] truncate">
            {server.name}
            <p className="truncate text-sm font-normal text-secondary-foreground">
              {server.addr.split(":")[0] + ":" + server.gamePort}
            </p>
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to connect to this server! If you do not have the mods
            for this server downloaded, we'll download them for you.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Play</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
