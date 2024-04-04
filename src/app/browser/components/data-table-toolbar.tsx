import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { maps } from "../data/filter-data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableModFilter } from "./data-table-mod-filter"
import { DataTablePingFilter } from "./data-table-ping-filter"
import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
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
          <DataTableFacetedFilter
            column={table.getColumn("Map")}
            title="Map"
            options={maps}
          />
        )}
        {table.getColumn("Mods") && (
          <DataTableModFilter column={table.getColumn("Mods")} title="Mods" />
        )}
        {table.getColumn("Ping") && (
          <DataTablePingFilter column={table.getColumn("Ping")} title="Ping" />
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
      <DataTableViewOptions table={table} />
    </div>
  )
}
