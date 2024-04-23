import { z } from "zod"

// Schema Definitions
export const modListSchema = z.object({
  workshopId: z.number(),
  name: z.string(),
})

export const serverSchema = z.object({
  addr: z.string(),
  gamePort: z.number(),
  steamId: z.string(),
  name: z.string(),
  appId: z.number(),
  gameDir: z.string(),
  version: z.string(),
  product: z.string(),
  region: z.number(),
  players: z.number(),
  maxPlayers: z.number(),
  bots: z.number(),
  map: z.string(),
  secure: z.boolean(),
  dedicated: z.boolean(),
  os: z.string(),
  gameType: z.string(),
  modList: z.array(modListSchema).or(z.null()).or(z.undefined()),
  ping: z.number().or(z.null()).or(z.undefined()),
})

export const serverListSchema = z.array(serverSchema)

// Type Definitions
export type ModList = z.infer<typeof modListSchema>
export type Server = z.infer<typeof serverSchema>
export type ServerList = z.infer<typeof serverListSchema>
