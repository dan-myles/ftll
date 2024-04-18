import { type Row } from "@tanstack/react-table"
import { maps } from "@/data/map-filter-data"

interface MapViewProps<TData> {
  row: Row<TData>
}

export function MapView<TData>({ row }: MapViewProps<TData>) {
  /*
    Render mapData.label if "map" is found in that array,
    otherwise render the value as a string. We do this to
    ensure that we can have neat labels for the maps when possible.
  */
  const map = row.getValue("Map")
  const mapData = maps.find((m) => m.value === map)

  return <div>{mapData ? mapData.label : (map as string)}</div>
}
