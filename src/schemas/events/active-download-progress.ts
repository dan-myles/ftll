import { z } from "zod"

// Schema Definition
export const ActiveDownloadProgressSchema = z.object({
  published_file_id: z.number(),
  bytes_downloaded: z.number(),
  bytes_total: z.number(),
  percentage_downloaded: z.number(),
})

// Type Definition
export type ActiveDownloadProgressEvent = z.infer<
  typeof ActiveDownloadProgressSchema
>
