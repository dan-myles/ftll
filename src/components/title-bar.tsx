"use client"

import { Menubar, MenubarMenu } from "@/components/ui/menubar"
import { Rocket } from "lucide-react"
import { WindowTitlebar } from "./tauri-controls"

export function TitleBar() {
  return (
    <WindowTitlebar controlsOrder="right">
      <Menubar className="h-10 rounded-none border-b border-none bg-transparent pl-2 lg:pl-3">
        <MenubarMenu>
          {/* App Logo */}
          <div className="inline-flex h-fit w-fit items-center text-white dark:text-indigo-500">
            <Rocket className="h-5 w-5" />
          </div>
        </MenubarMenu>

        <MenubarMenu>
          <div className="text-md h-fit pl-2 font-bold text-white">FTLL</div>
        </MenubarMenu>
      </Menubar>

      <div className="flex flex-grow" data-tauri-drag-region></div>
      <div className="mb-1 mt-1"></div>
    </WindowTitlebar>
  )
}
