import { type Row } from "@tanstack/react-table"
import { type Server32 } from "@/tauri-bindings"

interface NameViewProps<TData> {
  row: Row<TData>
}

export function NameView<TData>({ row }: NameViewProps<TData>) {
  const server = row.original as Server32

  return (
    <div
      className="flex max-w-[350px] flex-col lg:max-w-[450px] xl:max-w-[550px]"
    >
      <div className="truncate font-medium">{server.name}</div>
      <div className="truncate text-gray-500">
        {server.mod_list?.map((mod) => (
          <span key={mod.workshop_id} className="text-gray-500">
            {mod.name} |{" "}
          </span>
        ))}
      </div>
    </div>
  )
}
