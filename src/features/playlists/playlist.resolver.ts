import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Playlist } from './playlist.model';
import { PlaylistsService } from './playlist.service';

@Resolver(() => Playlist)
export class PlaylistsResolver {
  constructor(private playlistsService: PlaylistsService) {}

  @Query(() => [Playlist])
  async user(@Args('userId', { type: () => Int }) userId: number) {
    return await this.playlistsService.findByUserId({ userId });
  }

  //   @Mutation()
  //   async createPlaylist(input: any) {
  //     return this.playlistsService.create(input);
  //   }
}
