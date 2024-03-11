import { z } from 'zod'

import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { serverSchema } from './data/schema'
import { Button } from '@/components/ui/button'

async function getServers() {
  // const res = await fetch('http://localhost:8080/api/v1/GetServerList')
  const res = await fetch('http://localhost:8080/api/v1/GetServerList', {
    cache: 'no-cache',
  })
  const servers = await res.json()
  return z.array(serverSchema).parse(servers)
}

export default async function BrowserPage() {
  const servers = await getServers()

  return (
    <div className="h-full flex-1 flex-col space-y-4 p-4 md:flex">
      {/* Content */}
      <DataTable data={servers} columns={columns} />
    </div>
  )
}
