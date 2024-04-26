import { invoke } from "@tauri-apps/api/core"
import { Button } from "@/components/ui/button"
import { useServerListStore } from "@/stores/server-list-store"

export function Test() {
  const { serverList } = useServerListStore()

  // Test Mod
  // https://steamcommunity.com/sharedfiles/filedetails/?id=3147619641&searchtext=
  const id = 3147619641

  const testClick = async () => {
    console.log("Downloading sharks!", id)
    await invoke("download_mod", { publishedFileId: id }).catch((e) => {
      console.error(e)
    })
  }

  return (
    <div>
      <Button
        onClick={() => {
          testClick().catch((e) => {
            console.error(e)
          })
        }}
      >
        Test
      </Button>
    </div>
  )
}
