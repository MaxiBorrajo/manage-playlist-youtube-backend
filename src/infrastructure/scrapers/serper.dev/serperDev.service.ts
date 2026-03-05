import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  SerperDevCountryCode,
  SerperDevDateRangeCode,
  SerperDevLanguageCode,
} from './serperDev.constants';
import { Scraper, ScraperTool } from '../scrapers.types';
import Anthropic from '@anthropic-ai/sdk';
import { SerperDevVideoSearchResponse } from './serperDev.types';
import { ToolResultBlockParam } from '@anthropic-ai/sdk/resources';

@Injectable()
export class SerperDevService extends ScraperTool implements Scraper {
  constructor(private readonly configService: ConfigService) {
    super('search_videos_serperdev');
  }

  async executeTool(
    block: Anthropic.Messages.ToolUseBlock,
  ): Promise<ToolResultBlockParam> {
    const { query, country, language, autocorrect, dateRange, page } =
      block.input as {
        query: string;
        country?: SerperDevCountryCode;
        language?: SerperDevLanguageCode;
        autocorrect?: boolean;
        dateRange?: SerperDevDateRangeCode;
        page?: number;
      };

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://google.serper.dev/videos',
      headers: {
        'X-API-KEY': this.configService.get<string>('SERPER_DEV_API_KEY')!,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        q: query,
        gl: country,
        hl: language,
        autocorrect,
        tbs: dateRange,
        page,
      }),
    };

    try {
      const response = await axios.request(config);
      return {
        tool_use_id: block.id,
        type: 'tool_result',
        content: JSON.stringify(response.data as SerperDevVideoSearchResponse),
      };
    } catch (error) {
      console.error('Error searching videos:', error);
      throw new Error('Failed to search videos');
    }
  }
}
