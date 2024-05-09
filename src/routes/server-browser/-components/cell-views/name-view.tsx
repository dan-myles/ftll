import { type Row } from "@tanstack/react-table"
import { type Server32 } from "@/tauri-bindings"

interface NameViewProps<TData> {
  row: Row<TData>
}

export function NameView<TData>({ row }: NameViewProps<TData>) {
  const server = row.original as Server32

  // Theres gotta be a better way to do this 💀
  if (!server.mod_list) {
    return (
      <div className="flex flex-col">
        <div
          className="truncate font-medium md:max-w-[350px] lg:max-w-[600px]
            xl:max-w-[850px]"
        >
          {server.name}
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex max-w-[350px] flex-col lg:max-w-[600px] xl:max-w-[850px]"
    >
      <div
        className="truncate font-medium md:max-w-[350px] lg:max-w-[600px]
          xl:max-w-[850px]"
      >
        {server.name}
      </div>
      <div className="truncate text-gray-500">
        {server.mod_list.map((mod) => {
          return (
            <span key={mod.workshop_id} className="text-gray-500">
              {mod.name} |{" "}
            </span>
          )
        })}
      </div>
    </div>
  )
}
