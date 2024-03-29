"use client"

import { Button } from "@/components/ui/button"
import Spinner from "@/components/ui/spinner"
import { invoke } from "@tauri-apps/api/core"
import Image from "next/image"
import { useEffect, useState } from "react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export default function Home() {
  return (
    <>
      <div className="flex-1 flex-col space-y-8 border-border p-8 md:flex">
        hello
      </div>
    </>
  )
}
