import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import { z } from "zod"

import { MainNav } from "@/components/main-nav"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { UserNav } from "./components/user-nav"
import { serverSchema } from "./data/schema"

export const metadata: Metadata = {
  title: "Server Browser",
  description: "A server browser for DayZ.",
}

// Simulate a database read for servers
// async function getServers() {
//   const data = await fs.readFile(
//     path.join(process.cwd(), "src/app/browser/data/servers.json")
//   )
//
//   const servers = JSON.parse(data.toString())
//
//   return z.array(serverSchema).parse(servers)
// }

// hit api for data
async function getServers() {
  const res = await fetch("http://localhost:8080/api/v1/GetServerList")
  // const res = await fetch("http://localhost:8080/api/v1/GetServerList", {
  //   cache: "force-cache",
  // })
  const servers = await res.json()
  return z.array(serverSchema).parse(servers)
}

export default async function BrowserPage() {
  const servers = await getServers()

  return (
    <>
      <div className="flex-1 flex-col space-y-8 p-8 md:flex">
        {/* Nav */}
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <UserNav />
            <MainNav className="mx-6" />
            {/* used to be search holder but moved it */}
            <div className="ml-auto flex items-center space-x-4"></div>
          </div>
        </div>
        {/* Content */}
        <DataTable data={servers} columns={columns} />
      </div>
    </>
  )
}
