import Anthropic from '@anthropic-ai/sdk';
import {
  ToolResultBlockParam,
  ToolUseBlock,
} from '@anthropic-ai/sdk/resources';
import { date, z } from 'zod';
import { id } from 'zod/v4/locales';

export const PlaylistResponseSchema = z.object({
  message: z.string().min(1),
  metadata: z
    .object({
      videos: z
        .array(
          z.object({
            id: z.number(),
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
      playlist: z
        .object({
          id: z.number(),
          name: z.string(),
          thumbnail: z.string().optional(),
          description: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type PlaylistResponse = z.infer<typeof PlaylistResponseSchema>;

export type PlaylistResponseWithRole = PlaylistResponse & { role: 'user' | 'assistant' };

