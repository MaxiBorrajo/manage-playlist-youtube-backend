import Anthropic from '@anthropic-ai/sdk';
import { ToolResultBlockParam } from '@anthropic-ai/sdk/resources';
import { Injectable } from '@nestjs/common';
import { Tool } from './claude.types';
import { SearcherService } from 'src/infrastructure/searcher/searcher.service';

@Injectable()
export class ToolsExecutionService {
  tools: Tool[] = [];
  constructor(private readonly searcherService: SearcherService) {
    this.tools.push(this.searcherService);
  }

  async execute(
    content: Anthropic.Messages.ContentBlock[],
  ): Promise<ToolResultBlockParam[]> {
    const toolBlocks = content.filter((block) => block.type === 'tool_use');

    const toolResultsPromises = await Promise.all(
      this.tools.map(async (tool) => tool.execute(toolBlocks)),
    );

    return toolResultsPromises.flatMap((result) => result.flat());
  }
}
