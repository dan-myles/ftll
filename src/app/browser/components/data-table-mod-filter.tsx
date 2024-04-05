import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  DotsHorizontalIcon,
  MagnifyingGlassIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"
import { Column } from "@tanstack/react-table"

interface DataTableModFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
}

export function DataTableModFilter<TData, TValue>({
  column,
  title,
}: DataTableModFilterProps<TData, TValue>) {
  const selectedValues = new Set(column?.getFilterValue() as number[])

  const handleValueChange = (value: string) => {
    column?.setFilterValue(value)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {selectedValues.size < 10 ? (
                  (column?.getFilterValue() as string) ?? ""
                ) : (
                  <DotsHorizontalIcon className="h-4 w-4" />
                )}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[225px] p-0" align="start">
        <div className="">
          <div
            className="flex items-center border-b px-3"
            cmdk-input-wrapper=""
          >
            <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder="Search..."
              value={(column?.getFilterValue() as string) ?? ""}
              onChange={(event) => handleValueChange(event.target.value)}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          {selectedValues.size > 0 && (
            <>
              <Button
                onClick={() => column?.setFilterValue(undefined)}
                className="relative flex w-full cursor-pointer select-none items-center
                rounded-sm px-2 py-1.5 text-sm font-extralight text-muted-foreground 
                outline-none aria-selected:bg-accent
                data-[disabled]:opacity-50"
                variant="ghost"
              >
                Clear filters
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
