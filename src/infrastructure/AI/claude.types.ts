import { date, z } from 'zod';

export const PlaylistResponseSchema = z.object({
  message: z.string(),
  videos: z
    .array(
      z.object({
        link: z.string(),
        title: z.string(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        channel: z.string(),
        date: z.string().optional(),
        duration: z.string().optional(),
        reason: z.string().optional(),
      }),
    )
    .optional(),
});
