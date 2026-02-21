import { Injectable } from '@nestjs/common';
import { Playlist } from './playlist.model';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { PlaylistRepository } from './playlist.repository';

@Injectable()
export class PlaylistsService {
  constructor(private readonly playlistRepository: PlaylistRepository) {}

  async create(playlist: Playlist) {
    const newPlaylist = this.playlistRepository.create(playlist);
    await this.playlistRepository.save(newPlaylist);
    return newPlaylist;
  }

  async findByUserId({ userId }: { userId: number }) {
    return await this.playlistRepository.findAll({
      where: {
        $or: [{ author: { id: userId } }, { savedBy: { id: userId } }],
      },
    });
  }

  async findOneById(id: number) {
    return await this.playlistRepository.findOne({ id });
  }
}
