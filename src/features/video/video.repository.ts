import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { BaseRepository } from 'src/shared/database/base.repository';
import { Video } from './video.model';

@Injectable()
export class VideoRepository extends BaseRepository<Video> {
  constructor(em: EntityManager) {
    super(em, Video);
  }

  async searchByEmbedding(
    embedding: number[],
    filters: { country?: string; language?: string; dateRange?: string },
    limit = 10,
  ): Promise<Video[]> {
    const results = await this.em
      .createQueryBuilder(Video, 'v')
      .select('*')
      .addSelect(`embedding <=> '[${embedding.join(',')}]' AS distance`)
      .andWhere({
        ...(filters.country && { country: filters.country }),
        ...(filters.language && { language: filters.language }),
      })
      .orderBy({ distance: 'ASC' })
      .limit(limit);

    return results;
  }
}
