"use client"

import { Row } from "@tanstack/react-table"
import { serverSchema } from "../data/schema"

interface DataTableTimeViewProps<TData> {
  row: Row<TData>
}

export function DataTableTimeView<TData>({
  row,
}: DataTableTimeViewProps<TData>) {
  const server = serverSchema.parse(row.original)
  const gametype = server.gametype

  // split gametype by comma
  const gametypeSplit = gametype.split(",")
  const time = gametypeSplit[gametypeSplit.length - 1]
  const timeFormatted = convertTime(time)

  return (
    <div className="flex max-w-fit flex-col space-y-1">{timeFormatted}</div>
  )
}

function convertTime(time: string) {
  // convert time to AM/PM
  const timeSplit = time.split(":")
  const hourInt = parseInt(timeSplit[0])
  const minute = timeSplit[1]
  const hour = hourInt > 12 ? hourInt - 12 : hourInt
  const ampm = hourInt >= 12 ? "PM" : "AM"

  return `${hour}:${minute} ${ampm}`
}
