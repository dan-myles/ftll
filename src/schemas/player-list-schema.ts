import { z } from "zod"

// Schema Definitions
export const playerSchema = z.object({
  avatar: z.array(z.number()),
  is_banned: z.boolean(),
  name: z.string(),
  nick_name: z.string(),
  steam_id: z.string(),
})

export const playerListSchema = z.array(playerSchema)

// Type Definitions
export type Player = z.infer<typeof playerSchema>
export type PlayerList = z.infer<typeof playerListSchema>
