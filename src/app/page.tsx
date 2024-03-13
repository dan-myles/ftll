"use client"

import { Button } from "@/components/ui/button"
import { invoke } from "@tauri-apps/api/core"

export default function Home() {
  const handleClick = async () => {
    let res = await invoke("get_server_list")
  }

  return (
    <>
      <div className="flex-1 flex-col space-y-8 border-border p-8 md:flex">
        <Button onClick={handleClick}>hello</Button>
        hello!
      </div>
    </>
  )
}
