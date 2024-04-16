import { z } from "zod"

// Schema Definition
export const playerCountSchema = z.object({
  response: z.object({
    player_count: z.number(),
    result: z.number(),
  }),
})

// Type Definition
export type PlayerCount = z.infer<typeof playerCountSchema>
