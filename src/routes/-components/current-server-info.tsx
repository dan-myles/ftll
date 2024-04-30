import { type Server } from "@/schemas/server-schema"

interface CurrentServerInfoProps {
  server: Server
}

export function CurrentServerInfo({ server }: CurrentServerInfoProps) {
  return (
    <>
      <p className="text-lg font-semibold">{server.name}</p>
      <div className="h-full text-gray-500">{server.addr}</div>
    </>
  )
}
