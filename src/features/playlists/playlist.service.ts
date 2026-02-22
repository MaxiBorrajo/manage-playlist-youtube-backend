import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Playlist } from './playlist.model';
import { EntityRepository, Loaded } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { PlaylistRepository } from './playlist.repository';
import { CreatePlaylistInput } from './dto/createPlaylist.input';
import { UpdatePlaylistInput } from './dto/updatePlaylist.input';

@Injectable()
export class PlaylistsService {
  constructor(private readonly playlistRepository: PlaylistRepository) {}

  async update(
    id: number,
    updatePlaylistInput: UpdatePlaylistInput,
    authorId: number,
  ) {
    const playlist = await this.findOneById(id, authorId);

    this.validateAuthor(playlist, authorId);

    this.playlistRepository.assign(playlist, updatePlaylistInput, {
      ignoreUndefined: true,
    });

    await this.playlistRepository.save(playlist);
    return playlist;
  }

  validateAuthor(
    playlist: Loaded<Playlist, never, '*', never>,
    authorId: number,
  ) {
    if (playlist.author.id !== authorId) {
      throw new UnauthorizedException(
        'You are not the author of this playlist',
      );
    }
  }

  async create(createPlaylistInput: CreatePlaylistInput, authorId: number) {
    const newPlaylist = this.playlistRepository.create({
      name: createPlaylistInput.name,
      description: createPlaylistInput.description,
      author: authorId,
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

  async findOneById(id: number, authorId: number) {
    const playlist = await this.playlistRepository.findOneOrFail({ id });
    this.validateIsPrivate(playlist, authorId);
    return playlist;
  }

  validateIsPrivate(
    playlist: Loaded<Playlist, never, '*', never>,
    authorId: number,
  ) {
    if (!playlist.isPublic && playlist.author.id !== authorId) {
      throw new UnauthorizedException('This playlist is private');
    }
  }
}
