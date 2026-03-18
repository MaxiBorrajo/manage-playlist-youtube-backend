import { Video } from 'src/features/video/video.model';
import { SearchQueryParams } from '../searcher.types';
import { VideoRepository } from 'src/features/video/video.repository';
import { VoyageAiService } from 'src/infrastructure/ai/voyageAi/voyageAi.service';

export abstract class Scraper {
  constructor(
    protected readonly videoRepository: VideoRepository,
    protected readonly voyageAiService: VoyageAiService,
  ) {}

  async scrape(params: SearchQueryParams): Promise<Omit<Video, 'embedding'>[]> {
    const data = await this.obtainData(params);
    const videos = await this.parseDataToVideos(params, data);
    //Pasar el save a segundo plano y retornar los videos creados con id y delegar el generar el embedding a un worker aparte, para asi poder mostrar los resultados al usuario lo antes posible y no hacerle esperar a que se generen los embeddings de cada video, que es lo que mas tarda de todo el proceso
    await this.saveVideos(videos);
    return videos.map((video) => {
      const { embedding, ...videoWithoutEmbedding } = video;
      return videoWithoutEmbedding;
    });
  }

  abstract obtainData(params: SearchQueryParams): Promise<unknown>;

  abstract parseDataToVideos(
    params: SearchQueryParams,
    data: unknown,
  ): Promise<Video[]> | Video[];

  async saveVideos(videos: Video[]): Promise<void> {
    await Promise.all(
      videos.map(async (video) => {
        const embedding = await this.voyageAiService.getEmbedding(
          JSON.stringify(video),
        );
        video.embedding = `[${embedding.join(',')}]`;
      }),
    );
    await this.videoRepository.upsertMany(videos, {
      onConflictAction: 'ignore',
    });
  }
}
