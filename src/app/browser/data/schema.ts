import { z } from "zod"

export const modListSchema = z.object({
  workshop_id: z.number(),
  name: z.string(),
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
  mod_list: z.array(modListSchema).or(z.null()).or(z.undefined()),
  ping: z.number().or(z.null()).or(z.undefined()),
})

export const serverListSchema = z.array(serverSchema)

export type ModList = z.infer<typeof modListSchema>
export type Server = z.infer<typeof serverSchema>
export type ServerList = z.infer<typeof serverListSchema>
