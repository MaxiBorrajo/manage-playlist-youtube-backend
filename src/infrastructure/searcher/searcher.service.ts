import { Injectable, Logger } from '@nestjs/common';
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
import { Video } from 'src/features/video/video.model';
import { Scraper } from './scrapers/scraper.types';
import { SerperDevService } from './scrapers/serper.dev/serperDev.service';

@Injectable()
export class SearcherService extends Tool {
  private readonly logger = new Logger(SearcherService.name);
  scrapers: Scraper[] = [];

  constructor(
    private readonly voyageAiService: VoyageAiService,
    private readonly videoRepository: VideoRepository,
    private readonly serperDevService: SerperDevService,
  ) {
    super('search_videos');
    this.scrapers.push(this.serperDevService);
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
    const {
      query,
      country,
      language,
      autocorrect,
      dateRange,
      page,
      excludeVideoIds,
    } = block.input as SearchQueryParams;

    console.log('excludeVideoIds:', excludeVideoIds);

    try {
      const embedding = await this.voyageAiService.getEmbedding(query);

      const videos = await this.videoRepository.searchByEmbedding(
        embedding,
        {
          country,
          language,
          excludeVideoIds,
        },
        7,
      );

      this.logger.log(
        `pgvector search for "${query}": ${videos.length} videos found (distances: ${videos.map((v) => v.distance?.toFixed(3)).join(', ')})`,
      );

      if (videos.length < 7) {
        this.logger.log(
          `Insufficient pgvector results (${videos.length} found, need 7+ with distance < 0.35). Falling back to scrapers.`,
        );
        return await this.executeScrapers(block.id, {
          query,
          country,
          language,
          autocorrect,
          dateRange,
          page,
        });
      }

      this.logger.log(`Returning ${videos.length} videos from pgvector.`);

      const relevantVideos = videos.filter(
        (video) => (video.distance ?? 1) < 0.35,
      );

      return {
        tool_use_id: block.id,
        type: 'tool_result',
        content: JSON.stringify(relevantVideos),
      };
    } catch (error) {
      if (error instanceof NoEmbeddingReturnException) {
        this.logger.warn(
          `Embedding generation failed for "${query}". Falling back to scrapers.`,
        );
        return await this.executeScrapers(block.id, {
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

  async executeScrapers(
    blockId: string,
    query: {
      query: string;
      country?: CountryCode;
      language: LanguageCode | undefined;
      autocorrect: boolean | undefined;
      dateRange: DateRangeCode | undefined;
      page: number | undefined;
    },
  ): Promise<ToolResultBlockParam> {
    this.logger.log(
      `Scraping videos for "${query.query}" using ${this.scrapers.length} scraper(s).`,
    );

    const videos: Omit<Video, 'embedding'>[] = (
      await Promise.all(this.scrapers.map((scraper) => scraper.scrape(query)))
    ).flat();

    this.logger.log(`Scrapers returned ${videos.length} videos.`);

    return {
      tool_use_id: blockId,
      type: 'tool_result',
      content: JSON.stringify(videos),
    };
  }
}
