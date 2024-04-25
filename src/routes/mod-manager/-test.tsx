import { invoke } from "@tauri-apps/api/core"
import { Button } from "@/components/ui/button"

export function Test() {
  const handleClick = async () => {
    const res = await invoke("download_mod", { publishedFileId: 1234 })
    console.log(res)
  }

  return (
    <div>
      <Button
        onClick={() => {
          handleClick().catch(console.error)
        }}
      >
        Test
      </Button>
    </div>
  )
}
