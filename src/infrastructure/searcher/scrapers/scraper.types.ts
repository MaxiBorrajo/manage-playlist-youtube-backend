import { Video } from 'src/features/video/video.model';
import { SearchQueryParams } from '../searcher.types';
import { VideoRepository } from 'src/features/video/video.repository';

export abstract class Scraper {
  constructor(protected readonly videoRepository: VideoRepository) {}
  async scrape(params: SearchQueryParams): Promise<Video[]> {
    const data = await this.obtainData(params);
    const videos = await this.parseDataToVideos(params, data);
    await this.saveVideos(videos);
    return videos;
  }
  
  abstract obtainData(params: SearchQueryParams): Promise<unknown>;

  abstract parseDataToVideos(params: SearchQueryParams, data: unknown): Promise<Video[]> | Video[];

  async saveVideos(videos: Video[]): Promise<void> {
    await this.videoRepository.save(videos);
  }
}
