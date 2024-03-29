"use client"

import { DotsHorizontalIcon, DotsVerticalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import {
  CopyIcon,
  FolderSyncIcon,
  HeartIcon,
  InfoIcon,
  Loader2Icon,
  LoaderIcon,
  LocateFixedIcon,
  PlayIcon,
  RefreshCcw,
  RefreshCcwDotIcon,
  RefreshCcwIcon,
  RefreshCwIcon,
  RefreshCwOffIcon,
} from "lucide-react"

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
import { Button } from "@/components/ui/button"

import { serverSchema } from "../data/schema"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTablePlayDialog<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const server = serverSchema.parse(row.original)

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div
          className="
          inline-flex h-8 w-8 items-center justify-center rounded-md text-sm 
          font-medium ring-offset-background transition-colors hover:bg-accent 
          hover:text-accent-foreground focus-visible:outline-none 
          focus-visible:ring-2 focus-visible:ring-ring 
          focus-visible:ring-offset-2 disabled:pointer-events-none 
          disabled:opacity-50"
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
