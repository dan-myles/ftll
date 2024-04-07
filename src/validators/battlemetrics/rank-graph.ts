import { z } from "zod"

export type RankGraphRes = z.infer<typeof rankGraphSchema>

export const rankGraphSchema = z.object({
  data: z.array(
    z.object({
      type: z.string(),
      attributes: z.object({ timestamp: z.string(), value: z.number() }),
    })
  ),
})
