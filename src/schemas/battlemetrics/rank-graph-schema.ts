import { z } from "zod"

// Schema Definition
export const rankGraphSchema = z.object({
  data: z.array(
    z.object({
      type: z.string(),
      attributes: z.object({ timestamp: z.string(), value: z.number() }),
    })
  ),
})

// Type Definition
export type RankGraphRes = z.infer<typeof rankGraphSchema>
