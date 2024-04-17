import { WindowTitlebar } from "@/components/window-controls"
import { Icons } from "./icons"

export function TitleBar() {
  return (
    <WindowTitlebar controlsOrder="right" className="bg-transparent">
      <div
        className="inline-flex justify-center p-2 text-white
          dark:text-indigo-500"
      >
        <Icons.rocket className="h-6 w-6" />
        <div className="text-md h-fit pl-3 font-bold text-white">FTLL</div>
      </div>
    </WindowTitlebar>
  )
}
