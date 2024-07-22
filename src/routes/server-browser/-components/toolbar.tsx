import { Cross2Icon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { maps } from "@/data/map-filter-data"
import { FacetedFilter } from "./faceted-filter"
import { ModFilter } from "./mod-filter"
import { PingFilter } from "./ping-filter"
import { ViewOptions } from "./view-options"

interface ToolbarProps<TData> {
  table: Table<TData>
}

export function Toolbar<TData>({ table }: ToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search..."
          value={(table.getColumn("Name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("Name")?.setFilterValue(event.target.value)
          }
          className="h-10 w-[300px] lg:w-[400px]"
        />
        {table.getColumn("Map") && (
          <FacetedFilter
            column={table.getColumn("Map")}
            title="Map"
            options={maps}
          />
        )}
        {table.getColumn("Mods") && (
          <ModFilter column={table.getColumn("Mods")} title="Mods" />
        )}
        {table.getColumn("Ping") && (
          <PingFilter column={table.getColumn("Ping")} title="Ping" />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <ViewOptions table={table} />
    </div>
  )
}
