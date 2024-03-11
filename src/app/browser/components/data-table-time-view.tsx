'use client'
import { Row } from '@tanstack/react-table'
import { serverSchema } from '../data/schema'
import { IceCreamIcon, MinusIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableTimeView<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const server = serverSchema.parse(row.original)

  if (!server.Time) {
    return (
      <div className="flex flex-col">
        <div className="max-w-fit truncate font-medium">N/A</div>
      </div>
    )
  }

  let time = server.Time.toString()
  let newTime = convertTime(time)

  return <div className="flex max-w-fit flex-col space-y-1">{newTime}</div>
}

// time format is HHMM integer 24 hour time
function convertTime(time: string) {
  // if time is 3 digits, add a 0 to the front
  if (time.length === 3) {
    time = `0${time}`
  }

  // if time is 2 digits, add a 00 to the front
  if (time.length === 2) {
    time = `00${time}`
  }

  // if time is 1 digit, add a 000 to the front
  if (time.length === 1) {
    time = `000${time}`
  }

  // convert time to AM/PM
  let hours = parseInt(time.slice(0, 2))
  let minutes = parseInt(time.slice(2, 4))
  let ampm = 'AM' || 'PM'

  if (hours > 12) {
    hours -= 12
    ampm = 'PM'
  }

  if (hours === 0) {
    hours = 12
  }

  let newHours = hours.toString()
  let newMinutes = minutes.toString()

  if (newMinutes.length === 1) {
    newMinutes = `0${newMinutes}`
  }

  const newTime = `${newHours}:${newMinutes} ${ampm}`
  return newTime
}
