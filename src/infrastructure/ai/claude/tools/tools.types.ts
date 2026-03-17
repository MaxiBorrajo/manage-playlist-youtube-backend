import Anthropic from "@anthropic-ai/sdk";
import { ToolResultBlockParam, ToolUseBlock } from "@anthropic-ai/sdk/resources";
import { Transactional } from "@mikro-orm/core";

export abstract class Tool {
  toolName: string;

  constructor(toolName: string) {
    this.toolName = toolName;
  }

  @Transactional()
  async execute(
    toolBlocks: ToolUseBlock[],
    ...args: any[]
  ): Promise<ToolResultBlockParam[]> {
    const correspondingToolBlocks = toolBlocks.filter(
      (block) => block.name === this.toolName,
    );

    const results: ToolResultBlockParam[] = [];

    await Promise.all(
      correspondingToolBlocks.map(async (block) => {
        const result = await this.executeTool(block, ...args);
        results.push(result);
      }),
    );

    return results;
  }

  abstract executeTool(
    block: Anthropic.Messages.ToolUseBlock,
    ...args: any[]
  ): Promise<ToolResultBlockParam>;
}
