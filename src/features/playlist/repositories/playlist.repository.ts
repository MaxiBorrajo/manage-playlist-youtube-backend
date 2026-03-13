import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { BaseRepository } from 'src/shared/database/base.repository';
import { Playlist } from '../models/playlist.model';

@Injectable()
export class PlaylistRepository extends BaseRepository<Playlist> {
  constructor(em: EntityManager) {
    super(em, Playlist);
  }
}
