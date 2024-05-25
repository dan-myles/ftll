import { useEffect, useRef } from "react"
import { useUserInfoStore } from "@/stores/user-info-store"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export function UserToolTip() {
  const user = useUserInfoStore((state) => state.user)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")

    const loadAvi = () => {
      if (!user.avi) {
        return
      }
      const imageData = new ImageData(new Uint8ClampedArray(user.avi), 64, 64)
      context?.putImageData(imageData, 0, 0)
    }

    loadAvi()
  }, [user.avi])

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex cursor-pointer justify-center pb-2">
            <canvas
              className="h-8 w-8"
              height="64"
              width="64"
              ref={canvasRef}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
          <p>{user.name}</p>
          <p className="text-[8px] text-gray-400 dark:text-gray-800">
            {user.steamId}
          </p>
        </TooltipContent>
      </Tooltip>
    </>
  )
}
