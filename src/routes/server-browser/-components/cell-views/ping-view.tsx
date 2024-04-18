import { useContext } from "react"
import { type Row } from "@tanstack/react-table"
import { UpdatedServerContext } from "../row"

interface PingViewProps<TData> {
  row: Row<TData>
}

export function PingView<TData>({ row }: PingViewProps<TData>) {
  const updatedServer = useContext(UpdatedServerContext)

  return (
    <div className="">
      {updatedServer ? (
        updatedServer.ping === 99999 ? (
          <div className="text-gray-700">Offline</div>
        ) : (
          <PingColored ping={updatedServer.ping!} />
        )
      ) : row.getValue("Ping") === 99999 ? (
        <div className="text-gray-700">Offline</div>
      ) : (
        <PingColored ping={row.getValue("Ping")} />
      )}
    </div>
  )
}

function PingColored({ ping }: { ping: number }) {
  if (ping <= 25) {
    return (
      <div className="text-green-400">
        <span>{ping}ms</span>
      </div>
    )
  }

  if (25 <= ping && ping <= 50) {
    return (
      <div className="text-green-600">
        <span>{ping}ms</span>
      </div>
    )
  }

  if (51 <= ping && ping <= 100) {
    return (
      <div className="text-yellow-300">
        <span>{ping}ms</span>
      </div>
    )
  }

  if (101 <= ping && ping <= 150) {
    return (
      <div className="text-yellow-600">
        <span>{ping}ms</span>
      </div>
    )
  }

  if (151 <= ping && ping <= 200) {
    return (
      <div className="text-red-300">
        <span>{ping}ms</span>
      </div>
    )
  }

  if (201 <= ping && ping <= 250) {
    return (
      <div className="text-red-500">
        <span>{ping}ms</span>
      </div>
    )
  }

  if (251 <= ping) {
    return (
      <div className="text-red-700">
        <span>{ping}ms</span>
      </div>
    )
  }
}
