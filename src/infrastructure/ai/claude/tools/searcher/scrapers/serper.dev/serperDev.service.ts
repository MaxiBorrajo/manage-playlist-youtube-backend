import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SerperDevVideoSearchResponse } from './serperDev.types';
import { ToolResultBlockParam } from '@anthropic-ai/sdk/resources';
import { SearchQueryParams } from '../../searcher.types';
import { Scraper } from '../scraper.types';
import { Video } from 'src/features/video/video.model';
import { VideoRepository } from 'src/features/video/video.repository';
import { VoyageAiService } from 'src/infrastructure/ai/voyageAi/voyageAi.service';
@Injectable()
export class SerperDevService extends Scraper {
  constructor(
    private readonly configService: ConfigService,
    protected readonly videoRepository: VideoRepository,
    protected readonly voyageAiService: VoyageAiService,
  ) {
    super(videoRepository, voyageAiService);
  }

  async obtainData(
    params: SearchQueryParams,
  ): Promise<SerperDevVideoSearchResponse> {
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
      const { data } = await axios.request(config);

      const responseData = data as SerperDevVideoSearchResponse;

      return responseData;
    } catch (error) {
      console.error('Error searching videos:', error);
      throw new Error('Failed to search videos');
    }
  }

  parseDataToVideos(
    params: SearchQueryParams,
    data: SerperDevVideoSearchResponse,
  ): Promise<Video[]> | Video[] {
    const videos: Video[] = data.videos.map((video) => {
      const url = video.videoUrl || video.link;
      const { videoId, source } = this.parseVideoUrl(url);
      return this.videoRepository.create({
        title: video.title,
        description: video.snippet,
        url,
        thumbnail: video.imageUrl,
        duration: video.duration,
        source,
        channel: video.channel,
        publishedAt: video.date,
        language: params.language || '',
        country: params.country || '',
      });
    });

    return videos;
  }

  private parseVideoUrl(url: string): { videoId: string; source: string } {
    try {
      const parsed = new URL(url);
      if (
        parsed.hostname.includes('youtube.com') ||
        parsed.hostname.includes('youtu.be')
      ) {
        const videoId =
          parsed.searchParams.get('v') || parsed.pathname.slice(1);
        return { videoId, source: 'youtube' };
      }
      return { videoId: '', source: parsed.hostname };
    } catch {
      return { videoId: '', source: '' };
    }
  }
}
