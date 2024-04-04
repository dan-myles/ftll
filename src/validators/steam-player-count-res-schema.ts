import { z } from "zod"

export const steamPlayerCountResSchema = z.object({
  response: z.object({
    player_count: z.number(),
    result: z.number(),
  }),
})

export type SteamPlayerCountRes = z.infer<typeof steamPlayerCountResSchema>
