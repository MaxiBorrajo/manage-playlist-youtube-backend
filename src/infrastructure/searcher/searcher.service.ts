import { Injectable } from '@nestjs/common';
import { inherits } from 'util';
import { Tool } from '../ai/claude/claude.types';
import {
  ToolUseBlock,
  ToolResultBlockParam,
} from '@anthropic-ai/sdk/resources';
import { CountryCode, DateRangeCode, LanguageCode } from './searcher.constants';
import { SearchQueryParams } from './searcher.types';
import { VideoRepository } from 'src/features/video/video.repository';
import { VoyageAiService } from '../ai/voyageAi/voyageAi.service';
import { NoEmbeddingReturnException } from '../ai/voyageAi/exceptions/noEmbeddingReturn.exception';

@Injectable()
export class SearcherService extends Tool {
  scrapers: Scraper[] = [];

  constructor(
    private readonly voyageAiService: VoyageAiService,
    private readonly videoRepository: VideoRepository,
  ) {
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

    try {
      const embedding = await this.voyageAiService.getEmbedding(query);

      const videos = await this.videoRepository.searchByEmbedding(
        embedding,
        {
          country,
          language,
        },
        30,
      );

      if (
        videos.length < 10 ||
        videos.some((v) => v.distance && v.distance > 0.5)
      ) {
        return await this.executeScrapers({
          query,
          country,
          language,
          autocorrect,
          dateRange,
          page,
        });
      }

      return {
        tool_use_id: block.id,
        type: 'tool_result',
        content: JSON.stringify(videos),
      };
    } catch (error) {
      if (error instanceof NoEmbeddingReturnException) {
        return await this.executeScrapers({
          query,
          country,
          language,
          autocorrect,
          dateRange,
          page,
        });
      }

      throw error;
    }
  }

  executeScrapers(query: {
    query: string;
    country?: CountryCode;
    language: LanguageCode | undefined;
    autocorrect: boolean | undefined;
    dateRange: DateRangeCode | undefined;
    page: number | undefined;
  }): ToolResultBlockParam | PromiseLike<ToolResultBlockParam> {
    throw new Error('Method not implemented.');
  }
}
