import { z } from "zod"

export const bmGraphDataPointSchema = z.object({
  type: z.literal("dataPoint"),
  attributes: z.object({
    timestamp: z.string(),
    value: z.number(),
  }),
})

export const bmGraphResSchema = z.object({
  data: z.array(bmGraphDataPointSchema),
})

export type BMGraphRes = z.infer<typeof bmGraphResSchema>
export type BMGraphDataPoint = z.infer<typeof bmGraphDataPointSchema>
