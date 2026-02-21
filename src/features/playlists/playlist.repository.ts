import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Playlist } from './playlist.model';
import { BaseRepository } from 'src/shared/database/base.repository';

@Injectable()
export class PlaylistRepository extends BaseRepository<Playlist> {
  constructor(em: EntityManager) {
    super(em, Playlist);
  }
}
