import { z } from "zod"

export const modListSchema = z.object({
  WorkshopId: z.number(),
  Name: z.string(),
})

export const serverSchema = z.object({
  addr: z.string(),
  gameport: z.number(),
  steamid: z.string(),
  name: z.string(),
  appid: z.number(),
  gamedir: z.string(),
  version: z.string(),
  product: z.string(),
  region: z.number(),
  players: z.number(),
  max_players: z.number(),
  bots: z.number(),
  map: z.string(),
  secure: z.boolean(),
  dedicated: z.boolean(),
  os: z.string(),
  gametype: z.string(),
  ModList: z.array(modListSchema).or(z.null()),
  Time: z.number().or(z.undefined()),
  Modded: z.boolean().or(z.undefined()),
  Ping: z.number().or(z.undefined()),
})

export const serverListSchema = z.array(serverSchema)

export type ModList = z.infer<typeof modListSchema>
export type Server = z.infer<typeof serverSchema>
export type ServerList = z.infer<typeof serverListSchema>
