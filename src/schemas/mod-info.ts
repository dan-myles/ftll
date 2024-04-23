import { z } from "zod"

// Schema Definition
export const modSchema = z.object({
  published_file_id: z.number(),
  title: z.string(),
  description: z.string(),
  owner_steam_id: z.number(),
  time_created: z.number(),
  time_updated: z.number(),
  time_added_to_user_list: z.number(),
  banned: z.boolean(),
  accepted_for_use: z.boolean(),
  tags: z.array(z.string()),
  tags_truncated: z.boolean(),
  file_size: z.number(),
  url: z.string(),
  num_upvotes: z.number(),
  num_downvotes: z.number(),
  score: z.number(),
  num_children: z.number(),
})

// Type Definition
export type ModInfo = z.infer<typeof modSchema>
