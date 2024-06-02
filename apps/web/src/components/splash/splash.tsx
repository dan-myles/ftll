"use client"

import { Backdrop } from "./backdrop"
import { Overlay } from "./overlay"

export function Splash() {
  return (
    <div className="h-screen">
      <Overlay />
      <Backdrop />
    </div>
  )
}
