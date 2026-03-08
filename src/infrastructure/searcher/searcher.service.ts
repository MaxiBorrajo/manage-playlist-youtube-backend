import { Injectable } from '@nestjs/common';
import { inherits } from 'util';
import { Tool } from '../ai/claude.types';
import {
  ToolUseBlock,
  ToolResultBlockParam,
} from '@anthropic-ai/sdk/resources';
import { CountryCode, DateRangeCode, LanguageCode } from './searcher.constants';
import { SearchQueryParams } from './searcher.types';

@Injectable()
export class SearcherService extends Tool {
  scrapers: Scraper[] = [];
  constructor() {
    super('search_videos');
  }

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

  async executeTool(
    block: ToolUseBlock,
    ...args: any[]
  ): Promise<ToolResultBlockParam> {
      

    const { query, country, language, autocorrect, dateRange, page } =
      block.input as SearchQueryParams;

    
  }
}
