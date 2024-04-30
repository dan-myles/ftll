import { useEffect } from "react"
import { invoke } from "@tauri-apps/api/core"
import { listen } from "@tauri-apps/api/event"
import { Button } from "@/components/ui/button"
import { useModDownloadQueue } from "@/stores/mod-download-queue"
import { useServerListStore } from "@/stores/server-list-store"

export function Test() {
  const { serverList } = useServerListStore()
  const { pushMod } = useModDownloadQueue()

  // Test Mod
  // https://steamcommunity.com/sharedfiles/filedetails/?id=3147619641&searchtext=
  const id = 3147619641

  const testClick = async () => {
    console.log("Downloading sharks!", id)
    await invoke("mdq_mod_add", { publishedFileId: id }).catch((e) => {
      console.error(e)
    })
  }

  const testClick1 = async () => {
    console.log("removing sharks 💀💀💀", id)
    await invoke("steam_remove_mod_forcefully", { publishedFileId: id }).catch(
      (e) => {
        console.error(e)
      }
    )
  }

  const testClick2 = async () => {
    console.log("FORCE MOUNT ✅✅")
    await invoke("steam_mount_api").catch((e) => {
      console.error(e)
    })
  }

  const testClick3 = async () => {
    console.log("FORCE UNMOUNT 👹👹")
    await invoke("steam_unmount_api").catch((e) => {
      console.error(e)
    })
  }

  const forceDownload = async () => {
    console.log("Fixing sharks FORCE ⚙️⚙️")
    await invoke("steam_fix_mod_forcefully", { publishedFileId: id }).catch(
      (e) => {
        console.error(e)
      }
    )
  }

  const bigTest = async () => {
    console.log("BIG TEST")

    pushMod({ workshopId: 2489196158, name: "splurges bag" }).catch(
      console.error
    )
    pushMod({ workshopId: 3033180005, name: "karma balance chern" }).catch(
      console.error
    )
  }

  const bigTest2 = async () => {
    await invoke("steam_remove_mod_forcefully", {
      publishedFileId: 2489196158,
    }).catch((e) => {
      console.error(e)
    })

    await invoke("steam_remove_mod_forcefully", {
      publishedFileId: 3033180005,
    }).catch((e) => {
      console.error(e)
    })
  }

  // useffect to listen to event
  useEffect(() => {
    const unlisten = listen("mdq_active_download_progress", (event) => {
      console.log(event)
    }).catch(console.error)

    const unlisten2 = listen("steam_fix_mod_forcefully_progress", (event) => {
      console.log(event)
    }).catch(console.error)

    return () => {
      unlisten.then((f) => f?.()).catch(console.error)
      unlisten2.then((f) => f?.()).catch(console.error)
    }
  }, [])

  return (
    <div>
      <Button
        onClick={() => {
          testClick().catch((e) => {
            console.error(e)
          })
        }}
      >
        download sharks
      </Button>
      <Button
        onClick={() => {
          testClick1().catch((e) => {
            console.error(e)
          })
        }}
      >
        force remove sharks
      </Button>
      <Button
        onClick={() => {
          testClick2().catch((e) => {
            console.error(e)
          })
        }}
      >
        mount steam api
      </Button>
      <Button
        onClick={() => {
          testClick3().catch((e) => {
            console.error(e)
          })
        }}
      >
        unmount steam api
      </Button>
      <Button
        onClick={() => {
          forceDownload().catch((e) => {
            console.error(e)
          })
        }}
      >
        fix sharks FORCE
      </Button>
      <Button
        onClick={() => {
          bigTest().catch((e) => {
            console.error(e)
          })
        }}
      >
        2 mods
      </Button>
      <Button
        onClick={() => {
          bigTest2().catch((e) => {
            console.error(e)
          })
        }}
      >
        remove 2 mods
      </Button>
    </div>
  )
}
