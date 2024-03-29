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

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { serverSchema } from "../data/schema"
import { useState } from "react"
import DataTableMoreInfo from "./data-table-more-info"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const server = serverSchema.parse(row.original)
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)
  const handleOpen = () => setOpen(true)

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
          <DropdownMenuItem>
            <RefreshCcwIcon className="mr-2 h-4 w-4" />
            Refresh
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FolderSyncIcon className="mr-2 h-4 w-4" />
            Reload Mods
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <HeartIcon className="mr-2 h-4 w-4" />
            Favorite
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon className="mr-2 h-4 w-4" />
            Copy
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleOpen}>
            <InfoIcon className="mr-2 h-4 w-4" />
            More Info
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DataTableMoreInfo open={open} onClose={handleClose} row={row} />
    </>
  )
}
