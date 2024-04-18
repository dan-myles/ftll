import { type HTMLProps, useContext } from "react"
import { cn } from "@/lib/utils"
import { Button } from "../components/button"
import { Icons } from "../components/icons"
import TauriAppWindowContext from "../contexts/plugin-window"

export function Windows({ className, ...props }: HTMLProps<HTMLDivElement>) {
  const { isWindowMaximized, minimizeWindow, maximizeWindow, closeWindow } =
    useContext(TauriAppWindowContext)

  return (
    <div className={cn("h-10", className)} {...props}>
      <Button
        onClick={minimizeWindow}
        className="max-h-10 w-[46px] cursor-default rounded-none bg-transparent
          text-black hover:bg-black/[.05] active:bg-black/[.03] dark:text-white
          dark:hover:bg-white/[.06] dark:active:bg-white/[.04]"
      >
        <Icons.minimizeWin />
      </Button>
      <Button
        onClick={maximizeWindow}
        className={cn(
          "max-h-10 w-[46px] cursor-default rounded-none bg-transparent",
          `text-black hover:bg-black/[.05] active:bg-black/[.03] dark:text-white
          dark:hover:bg-white/[.06] dark:active:bg-white/[.04]`
          // !isMaximizable && "text-white/[.36]",
        )}
      >
        {!isWindowMaximized ? (
          <Icons.maximizeWin />
        ) : (
          <Icons.maximizeRestoreWin />
        )}
      </Button>
      <Button
        onClick={closeWindow}
        className="max-h-10 w-[46px] cursor-default rounded-none bg-transparent
          text-black hover:bg-[#c42b1c] hover:text-white active:bg-[#c42b1c]/90
          dark:text-white"
      >
        <Icons.closeWin />
      </Button>
    </div>
  )
}
