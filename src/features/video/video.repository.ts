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
    filters: { country?: string; language?: string; dateRange?: string; excludeVideoIds?: number[] },
    limit = 10,
  ): Promise<Video[]> {
    const conditions: string[] = [];
    const filterParams: unknown[] = [];

    if (filters.country) {
      filterParams.push(filters.country);
      conditions.push(`v.country = ?`);
    }
    if (filters.language) {
      filterParams.push(filters.language);
      conditions.push(`v.language = ?`);
    }
    if (filters.excludeVideoIds && filters.excludeVideoIds.length > 0) {
      filterParams.push(...filters.excludeVideoIds);
      conditions.push(`v.id NOT IN (${filters.excludeVideoIds.map(() => '?').join(',')})`);
    }


    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const vectorStr = `[${embedding.join(',')}]`;

    const params: unknown[] = [vectorStr, ...filterParams, limit];

    const sql = `
      SELECT v.*, (v.embedding <=> ?::vector) AS distance
      FROM video v
      ${whereClause}
      ORDER BY distance ASC
      LIMIT ?
    `;

    const rows = await this.em.getConnection().execute(sql, params);

    return rows.map((row) => {
      const video = this.em.map(Video, row);
      video.distance = parseFloat(row.distance);
      return video;
    });
  }
}
