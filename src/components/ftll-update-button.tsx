import { useState } from "react"
import { UpdateIcon } from "@radix-ui/react-icons"
import { invoke } from "@tauri-apps/api/core"
import { Button } from "./ui/button"

export function FTLLUpdateButton({
  setUpdateText,
}: {
  setUpdateText: (text: string) => void
}) {
  const [needsUpdate, setNeedsUpdate] = useState(false)

  async function checkForUpdates() {
    const res = await invoke("check_for_updates")
    if (res === null) {
      setUpdateText("You're on the latest version!")
      setNeedsUpdate(false)
    } else {
      setUpdateText("An update is available!")
      setNeedsUpdate(true)
    }
  }

  return (
    <Button
      type="submit"
      variant="outline"
      className="h-7 gap-1"
      onClick={() => checkForUpdates().catch(console.error)}
    >
      <UpdateIcon /> {needsUpdate ? "Update" : "Check for Updates"}
    </Button>
  )
}
