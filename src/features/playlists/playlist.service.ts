import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Playlist } from './playlist.model';
import { Loaded } from '@mikro-orm/core';
import { PlaylistRepository } from './playlist.repository';
import { CreatePlaylistInput } from './dto/createPlaylist.input';
import { UpdatePlaylistInput } from './dto/updatePlaylist.input';
import { YoutubeService } from 'src/infrastructure/youtube/youtube.service';
import { UsersService } from '../users/user.service';

@Injectable()
export class PlaylistsService {
  constructor(
    private readonly playlistRepository: PlaylistRepository,
    private readonly youtubeService: YoutubeService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async syncFromYoutube(userId: number) {
    const user = await this.userService.findOneById(userId);
    const playlistsFromYoutube = await this.youtubeService.getPlaylists(
      user.googleAccessToken,
      user.googleRefreshToken,
    );

    if (playlistsFromYoutube.items && playlistsFromYoutube.items.length > 0) {
      const playlists = playlistsFromYoutube.items.map((playlist) =>
        this.playlistRepository.create({
          author: userId,
          name: playlist.snippet!.title!,
          description: playlist.snippet!.description!,
          thumbnail: playlist.snippet!.thumbnails!.default!.url!,
          isPublic: playlist.status!.privacyStatus === 'public',
          createdAt: new Date(playlist.snippet!.publishedAt!),
          youtubePlaylistId: playlist.id!,
        }),
      );

      console.log(playlists);

      await this.playlistRepository.save(playlists);
    }
  }

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
