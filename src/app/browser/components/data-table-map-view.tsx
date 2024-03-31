import { Row } from "@tanstack/react-table"
import { maps } from "../data/filter-data"

interface DataTableMapViewProps<TData> {
  row: Row<TData>
}

export function DataTableMapView<TData>({ row }: DataTableMapViewProps<TData>) {
  /* 
    Render mapData.label if "map" is found in that array,
    otherwise render the value as a string. We do this to
    ensure that we can have neat labels for the maps when possible.
  */
  const map = row.getValue("map")
  const mapData = maps.find((m) => m.value === map)

  return <div>{mapData ? mapData.label : (map as string)}</div>
}
