import { RocketIcon } from "@radix-ui/react-icons"
import { WindowTitlebar } from "@/components/window-controls"

export function TitleBar() {
  return (
    <WindowTitlebar controlsOrder="right" className="bg-transparent">
      <div
        className="inline-flex justify-center p-2 text-white
          dark:text-indigo-500"
      >
        <RocketIcon className="h-5 w-5" />
        <div className="text-md h-fit pl-2 font-bold text-white">FTLL</div>
      </div>
    </WindowTitlebar>
  )
}
