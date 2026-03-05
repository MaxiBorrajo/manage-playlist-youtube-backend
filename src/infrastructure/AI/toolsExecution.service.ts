import Anthropic from '@anthropic-ai/sdk';
import {
  ContentBlock,
  ToolReferenceBlockParam,
  ToolResultBlockParam,
  ToolSearchToolResultBlockParam,
} from '@anthropic-ai/sdk/resources';
import { Injectable } from '@nestjs/common';
import { SerperDevService } from '../scrapers/serper.dev/serperDev.service';
import { UnknownType } from '@mikro-orm/core';
import { Scraper } from '../scrapers/scrapers.types';

@Injectable()
export class ToolsExecutionService {
  tools: Scraper[] = [];
  constructor(private readonly serperDevService: SerperDevService) {
    this.tools.push(serperDevService);
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
