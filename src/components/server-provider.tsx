"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"

export default function ServerProvider() {
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    // this function is called on mount every time application is launched
    // just to grab updated server list, merged with any locally cached servers
    const fetchServers = async () => {
      await invoke("first_app_launch")
      setLoading(false)
    }

    fetchServers()
  }, [])

  return (
    <AlertDialog open={isLoading}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Give me a moment... 🔎</AlertDialogTitle>
          <AlertDialogDescription>
            I'm importing some new servers for you! Hold on a second and I'll
            be done before you can say "supercalafragilisticexpialidocious"!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="">
          <div className="flex w-full justify-center">
            <div className="">
              <img src="/zombie-bloody.gif" alt="zombie" />
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
