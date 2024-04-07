import { z } from "zod"

export type PlayerCount = z.infer<typeof playerCountSchema>

export const playerCountSchema = z.object({
  response: z.object({
    player_count: z.number(),
    result: z.number(),
  }),
})
