import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = [
    "Bytes",
    "KiB",
    "MB",
    "GB",
    "TB",
    "PetaBytes 💀💀💀💀",
    "ExaBytes 😥😥😥😥😥😥😥😥😥😥😥😥😥😥😥😥😥😥😥😥😥😥😥😥😥😥",
    "ZiB ... this not okay bro",
    "YiB ... hmu if you see this, i need some storage 💀",
  ]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
