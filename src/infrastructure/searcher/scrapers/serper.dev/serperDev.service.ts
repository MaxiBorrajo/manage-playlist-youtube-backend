import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SerperDevVideoSearchResponse } from './serperDev.types';
import { ToolResultBlockParam } from '@anthropic-ai/sdk/resources';
import { SearchQueryParams } from '../../searcher.types';

@Injectable()
export class SerperDevService{
  constructor(private readonly configService: ConfigService) {
  }

  async executeTool(
    params: SearchQueryParams
  ): Promise<ToolResultBlockParam> {
    const { query, country, language, autocorrect, dateRange, page } = params;
    
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
