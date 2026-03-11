import Anthropic from '@anthropic-ai/sdk';
import { ToolResultBlockParam } from '@anthropic-ai/sdk/resources';
import { date, z } from 'zod';

export const PlaylistResponseSchema = z.object({
  message: z.string(),
  metadata: z
    .object({
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
    })
    .optional(),
});

export type PlaylistResponse = z.infer<typeof PlaylistResponseSchema>;


export abstract class Tool {
  toolName: string;

  constructor(toolName: string) {
    this.toolName = toolName;
  }

  abstract execute(
    toolBlocks: Anthropic.Messages.ToolUseBlock[],
    ...args: any[]
  ): Promise<ToolResultBlockParam[]>;

  abstract executeTool(
    block: Anthropic.Messages.ToolUseBlock,
    ...args: any[]
  ): Promise<ToolResultBlockParam>;
}
