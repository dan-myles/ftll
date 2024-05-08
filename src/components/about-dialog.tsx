import { useCallback, useState } from "react"
import { FTLLUpdateButton } from "./ftll-update-button"
import { Icons } from "./icons"
import { Logo } from "./logo"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

export function AboutDialog() {
  const [updateText, setUpdateText] = useState("")
  const [version, setVersion] = useState("")
  const [_name, setName] = useState("")
  const [_tauriVersion, setTauriVersion] = useState("")
  const [arch, setArch] = useState("")

  const getInfo = useCallback(async () => {
    const { getName, getTauriVersion, getVersion } = await import(
      "@tauri-apps/api/app"
    )
    const { arch } = await import("@tauri-apps/plugin-os")

    getName()
      .then((x) => setName(x))
      .catch(console.error)
    getVersion()
      .then((x) => setVersion(x))
      .catch(console.error)
    getTauriVersion()
      .then((x) => setTauriVersion(x))
      .catch(console.error)
    arch()
      .then((x) => setArch(x))
      .catch(console.error)
  }, [])

  if (typeof window !== "undefined") {
    getInfo().catch(console.error)
  }

  const open = useCallback(async (url: string) => {
    const { open } = await import("@tauri-apps/plugin-shell")
    open(url).catch(console.error)
  }, [])

  return (
    <DialogContent className="overflow-clip pb-2">
      <DialogHeader className="flex items-center text-center">
        <div
          onClick={() => open("https://ftl-launcher.com/")}
          className="cursor-pointer"
        >
          <Logo />
        </div>

        <DialogTitle className="flex flex-col items-center gap-2 pt-2">
          <span className="flex gap-1 font-mono text-xs font-medium">
            v{version} ({arch})
            <span className="font-sans font-medium text-gray-400">
              (
              <span
                className="cursor-pointer text-blue-500"
                onClick={() =>
                  open(
                    `https://github.com/avvo-na/ftl-launcher/releases/tag/v${version}`
                  ).catch(console.error)
                }
              >
                release notes
              </span>
              )
            </span>
          </span>
        </DialogTitle>

        <DialogDescription className=" text-foreground">
          A lightweight, open-source, mod launcher for DayZ Standalone.
        </DialogDescription>

        <span className="text-xs text-gray-400">{updateText}</span>
        <DialogDescription className="flex flex-row"></DialogDescription>
      </DialogHeader>

      <DialogFooter
        className="flex flex-row items-center border-t pt-2 text-slate-400"
      >
        <div className="mr-auto flex flex-row gap-2">
          <Icons.home
            className="h-5 w-5 cursor-pointer transition hover:text-slate-300"
            onClick={() => open("https://ftl-launcher.com")}
          />
          <Icons.gitHub
            className="h-5 w-5 cursor-pointer transition hover:text-slate-300 "
            onClick={() =>
              open("https://github.com/danlikestocode/ftl-launcher")
            }
          />
        </div>

        <FTLLUpdateButton setUpdateText={setUpdateText} />
      </DialogFooter>
    </DialogContent>
  )
}
