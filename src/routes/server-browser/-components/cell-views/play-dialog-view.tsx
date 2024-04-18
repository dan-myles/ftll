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
import { serverSchema } from "@/schemas/ftla/server-schema"

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
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
