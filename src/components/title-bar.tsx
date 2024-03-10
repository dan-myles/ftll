'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import logo from '@/assets/logo.png'
import { Globe, Mic, Sailboat } from 'lucide-react'

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar'

import { AboutDialog } from './about-dialog'
import { ModeToggle } from './mode-toggle'
import { Dialog, DialogTrigger } from './ui/dialog'
import { WindowTitlebar } from './tauri-controls'

export function TitleBar() {
  return (
    <WindowTitlebar controlsOrder="right" className="border-b">
      <Menubar className="h-10 rounded-none border-b border-none pl-2 lg:pl-3">
        <MenubarMenu>
          {/* App Logo */}
          <div className="inline-flex h-fit w-fit items-center text-cyan-500">
            {usePathname() === '/' || usePathname() === '/examples/music' ? (
              <Image src={logo} alt="logo" width={20} height={20} />
            ) : (
              <Sailboat className="h-5 w-5" />
            )}
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
