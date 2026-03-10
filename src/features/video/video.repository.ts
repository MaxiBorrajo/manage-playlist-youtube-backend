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
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (filters.country) {
      params.push(filters.country);
      conditions.push(`v.country = $${params.length}`);
    }
    if (filters.language) {
      params.push(filters.language);
      conditions.push(`v.language = $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const vectorStr = `[${embedding.join(',')}]`;
    params.push(vectorStr);
    const vectorParam = `$${params.length}`;

    params.push(limit);
    const limitParam = `$${params.length}`;

    const sql = `
      SELECT v.*, (v.embedding <=> ${vectorParam}::vector) AS distance
      FROM video v
      ${whereClause}
      ORDER BY distance ASC
      LIMIT ${limitParam}
    `;

    const rows = await this.em.getConnection().execute(sql, params);

    return rows.map((row: any) => {
      const video = this.em.map(Video, row);
      video.distance = parseFloat(row.distance);
      return video;
    });
  }
}
