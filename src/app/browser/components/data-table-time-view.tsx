"use client"

import { Row } from "@tanstack/react-table"
import { serverSchema } from "../data/schema"
import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"

interface DataTableTimeViewProps<TData> {
  row: Row<TData>
}

export function DataTableTimeView<TData>({
  row,
}: DataTableTimeViewProps<TData>) {
  const [updatedTime, setUpdatedTime] = useState("")
  const server = serverSchema.parse(row.original)

  // split gametype by comma
  const gametype = server.gametype
  const gametypeSplit = gametype.split(",")
  const time = gametypeSplit[gametypeSplit.length - 1]
  const timeFormatted = convertTime(time)

  function convertTime(time: string) {
    // convert time to AM/PM
    const timeSplit = time.split(":")
    const hourInt = parseInt(timeSplit[0])
    const minute = timeSplit[1]
    const hour = hourInt > 12 ? hourInt - 12 : hourInt
    const ampm = hourInt >= 12 ? "PM" : "AM"

    return `${hour}:${minute} ${ampm}`
  }

  useEffect(() => {
    const updateServerPlayers = async () => {
      const res = await invoke("get_server_info", { server: server })
      const updatedServer = serverSchema.parse(res)
      const gametype = updatedServer.gametype
      const gametypeSplit = gametype.split(",")
      const time = gametypeSplit[gametypeSplit.length - 1]
      const timeFormatted = convertTime(time)
      if (timeFormatted.includes("NaN")) {
        setUpdatedTime("")
      } else {
        setUpdatedTime(timeFormatted)
      }
    }

    let interval: NodeJS.Timeout
    let timeout2: NodeJS.Timeout

    // this is a hacky way to avoid spamming the server
    // much better if we could cancel waiting requests if the component unmounts
    // but idk rust thaaaaaaaaaaaaat well
    // we wait 2.5 seconds before starting the interval
    // so we can avoid spamming the server with requests
    // on components that mounted and unmounted quickly
    const timeout = setTimeout(() => {
      // then we start the interval
      interval = setInterval(() => {
        // sleep random time between 0 and 5 seconds
        timeout2 = setTimeout(
          () => {
            // finally we update the server ping
            updateServerPlayers()
          },
          Math.floor(Math.random() * 15000)
        )
      }, 5000)
    }, 2500)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
      clearTimeout(timeout2)
    }
  }, [])

  return (
    <div className="flex max-w-fit flex-col space-y-1">
      {updatedTime !== "" ? updatedTime : timeFormatted}
    </div>
  )
}
