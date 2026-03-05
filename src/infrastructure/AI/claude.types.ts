import { z } from 'zod';

export const PlaylistResponseSchema = z.object({
  message: z.string(),
  videos: z
    .array(
      z.object({
        videoId: z.string(),
        title: z.string(),
        channel: z.string(),
        duration: z.string().optional(),
        reason: z.string().optional(),
      }),
    )
    .optional(),
});
