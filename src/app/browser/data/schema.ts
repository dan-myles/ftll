import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
})

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
})

export type Task = z.infer<typeof taskSchema>
export type ModList = z.infer<typeof modListSchema>
export type Server = z.infer<typeof serverSchema>
