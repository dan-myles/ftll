import { GeistSans } from "geist/font/sans"
import "@/styles/globals.css"

export const metadata = {
  title: "FTLL",
  description: "A next generation mod launcher for DayZ.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
