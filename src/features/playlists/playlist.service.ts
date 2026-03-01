import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Playlist } from './playlist.model';
import { Loaded } from '@mikro-orm/core';
import { PlaylistRepository } from './playlist.repository';
import { UsersService } from '../users/user.service';

@Injectable()
export class PlaylistsService {
  constructor(private readonly playlistRepository: PlaylistRepository) {}

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

  async findByUserId({ userId }: { userId: number }) {
    return await this.playlistRepository.findAll({
      where: {
        $or: [{ author: { id: userId } }],
      },
    });
  }

  async findOneById(id: number, authorId: number) {
    const playlist = await this.playlistRepository.findOneOrFail({ id });
    this.validateAuthor(playlist, authorId);
    return playlist;
  }
}
