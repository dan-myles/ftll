import { Info } from "lucide-react"
import { useState } from "react"
import { MoreInfo } from "@/routes/server-browser/-components/more-info"
import { type Server } from "@/schemas/ftla/server-schema"
import { Button } from "./ui/button"

export function MoreInfoButton({ server }: { server: Server }) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Button variant="secondary" className="mb-[-8px]" onClick={handleOpen}>
      <Info size={16} />
      <MoreInfo server={server} open={open} onClose={handleClose} />
    </Button>
  )
}
