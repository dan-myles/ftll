import { type Row } from "@tanstack/react-table"
import { serverSchema } from "@/schemas/ftla/server-schema"

interface NameViewProps<TData> {
  row: Row<TData>
}

export function NameView<TData>({ row }: NameViewProps<TData>) {
  const server = serverSchema.parse(row.original)

  // Theres gotta be a better way to do this 💀
  if (!server.modList) {
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

  if (server.modList.at(0)?.workshopId === 0) {
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
    <div className="flex max-w-[350px] flex-col">
      <div
        className="truncate font-medium md:max-w-[350px] lg:max-w-[600px]
          xl:max-w-[850px]"
      >
        {server.name}
      </div>
      <div className="truncate text-gray-500">
        {server.modList.map((mod) => {
          return (
            <span key={mod.workshopId} className="text-gray-500">
              {mod.name} |{" "}
            </span>
          )
        })}
      </div>
    </div>
  )
}
