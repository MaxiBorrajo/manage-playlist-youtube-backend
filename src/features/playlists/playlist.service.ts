import { Injectable } from '@nestjs/common';
import { Playlist } from './playlist.model';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { PlaylistRepository } from './playlist.repository';
import { CreatePlaylistInput } from './dto/createPlaylist.input';
import { UpdatePlaylistInput } from './dto/updatePlaylist.input';

@Injectable()
export class PlaylistsService {
  constructor(private readonly playlistRepository: PlaylistRepository) {}

  async update(id: number, updatePlaylistInput: UpdatePlaylistInput) {
    const playlist = await this.findOneById(id);
    this.playlistRepository.assign(playlist, updatePlaylistInput, {
      ignoreUndefined: true,
    });
    await this.playlistRepository.save(playlist);
    return playlist;
  }

  async create(createPlaylistInput: CreatePlaylistInput) {
    const newPlaylist = this.playlistRepository.create({
      name: createPlaylistInput.name,
      description: createPlaylistInput.description,
      author: createPlaylistInput.authorId,
      videos: createPlaylistInput.videoIds || [],
    });
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
    return await this.playlistRepository.findOneOrFail({ id });
  }
}
