"use client"

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Sailboat } from "lucide-react"
import { AboutDialog } from "./about-dialog"
import { ModeToggle } from "./mode-toggle"
import { WindowTitlebar } from "./tauri-controls"
import { Dialog, DialogTrigger } from "./ui/dialog"

export function TitleBar() {
  return (
    <WindowTitlebar controlsOrder="right" className="border-b">
      <Menubar className="h-10 rounded-none border-b border-none pl-2 lg:pl-3">
        <MenubarMenu>
          {/* App Logo */}
          <div className="inline-flex h-fit w-fit items-center text-cyan-500">
            <Sailboat className="h-5 w-5" />
          </div>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="h-fit font-bold">FTLL</MenubarTrigger>
          <Dialog modal={false}>
            <MenubarContent>
              <DialogTrigger asChild>
                <MenubarItem>About FTLL</MenubarItem>
              </DialogTrigger>

              <MenubarSeparator />
              <MenubarItem>
                Settings <MenubarShortcut>Ctrl+S</MenubarShortcut>
              </MenubarItem>
              <MenubarShortcut />
              <MenubarItem>
                Quit <MenubarShortcut>Ctrl+Q</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>

            <AboutDialog />
          </Dialog>
        </MenubarMenu>
      </Menubar>

      <div className="flex flex-grow" data-tauri-drag-region></div>
      <div className="mb-1 mt-1">
        <ModeToggle />
      </div>
    </WindowTitlebar>
  )
}
