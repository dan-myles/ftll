import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export function SteamPFPMedium({
  rgba,
  className,
}: {
  rgba: number[]
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")

    const array = new Uint8Array(rgba)
    const imageData = new ImageData(new Uint8ClampedArray(array), 64, 64)
    context?.putImageData(imageData, 0, 0)
  }, [rgba])

  return (
    <canvas
      className={cn("h-8 w-8", className)}
      height="64"
      width="64"
      ref={canvasRef}
    ></canvas>
  )
}
