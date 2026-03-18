import { Injectable, Logger } from '@nestjs/common';
import {
  ToolUseBlock,
  ToolResultBlockParam,
} from '@anthropic-ai/sdk/resources';
import { CountryCode, DateRangeCode, LanguageCode } from './searcher.constants';
import { SearchQueryParams } from './searcher.types';
import { VideoRepository } from 'src/features/video/video.repository';
import { Video } from 'src/features/video/video.model';
import { Scraper } from './scrapers/scraper.types';
import { SerperDevService } from './scrapers/serper.dev/serperDev.service';
import { Tool } from '../tools.types';
import { VoyageAiService } from 'src/infrastructure/ai/voyageAi/voyageAi.service';
import { NoEmbeddingReturnException } from 'src/infrastructure/ai/voyageAi/exceptions/noEmbeddingReturn.exception';

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

  async executeTool(
    block: ToolUseBlock,
    ...args: any[]
  ): Promise<ToolResultBlockParam> {
    const {
      query,
      country,
      language,
      autocorrect,
      forceScraping,
      dateRange,
      page,
      excludeVideoIds,
    } = block.input as SearchQueryParams;

    console.log('excludeVideoIds:', excludeVideoIds);
    let videos: Video[] = [];

    try {
      if (!forceScraping) {
        const embedding = await this.voyageAiService.getEmbedding(query);

        videos = await this.videoRepository.searchByEmbedding(
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
      }

      //Si esta forzado a scrappear, o si el embedding no devuelve resultados relevantes, entonces scrappeo. Esto es para evitar el problema de que el embedding no sea bueno para ciertos tipos de consultas, lo cual hace que no se devuelvan resultados aunque existan videos relevantes en la base de datos.
      const relevantVideos = videos.filter(
        (video) => (video.distance ?? 1) < 0.30,
      );

      if (
        forceScraping ||
        relevantVideos.length < 3
      ) {
        this.logger.log(
          `Insufficient pgvector results (${relevantVideos.length} relevant with distance < 0.30 out of ${videos.length} found). Falling back to scrapers.`,
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

      this.logger.log(`Returning ${relevantVideos.length} relevant videos from pgvector.`);

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
