import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import { type Server32, commands } from "@/tauri-bindings"

export function useUpdateServer(s: Server32) {
  const [server, setServer] = useState<Server32>()

  // Normally we would use Tanstack Query here but the ping data changes
  // too frequently to be useful for caching. The cache limit is 5MB and
  // over time the cache would grow to be too large.
  useEffect(() => {
    const update = async () => {
      const updated = await commands.getServerInfo(s)

      if (updated.status === "error") {
        console.error(updated.error)
        return
      }

      setServer(updated.data)
    }

    let delayBeforeUpdate: NodeJS.Timeout
    let intervalToUpdate: NodeJS.Timeout

    // eslint-disable-next-line
    delayBeforeUpdate = setTimeout(
      () => {
        intervalToUpdate = setInterval(() => {
          void update()
        }, 3750)
      },
      Math.random() * 5000 + 3000
    )

    return () => {
      void invoke("destroy_server_info_semaphore")
      clearTimeout(delayBeforeUpdate)
      clearInterval(intervalToUpdate)
    }

    // eslint-disable-next-line
  }, [])

  return server
}
