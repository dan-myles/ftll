import { UpdateIcon } from "@radix-ui/react-icons"
import { invoke } from "@tauri-apps/api/core"
import { Button } from "./ui/button"

export function FTLLUpdateButton({
  setUpdateText,
}: {
  setUpdateText: (text: string) => void
}) {
  async function checkForUpdates() {
    const res = await invoke<string>("check_for_updates")
    setUpdateText(res)
  }

  return (
    <Button
      type="submit"
      variant="outline"
      className="h-7 gap-1"
      onClick={() => checkForUpdates().catch(console.error)}
    >
      <UpdateIcon /> Update
    </Button>
  )
}
