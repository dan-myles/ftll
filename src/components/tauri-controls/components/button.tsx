import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes } from "react"

export function Button({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex cursor-default items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
