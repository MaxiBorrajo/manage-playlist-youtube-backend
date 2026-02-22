import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Playlist } from './playlist.model';
import { PlaylistsService } from './playlist.service';
import { CreatePlaylistInput } from './dto/createPlaylist.input';
import { UpdatePlaylistInput } from './dto/updatePlaylist.input';

@Resolver(() => Playlist)
export class PlaylistsResolver {
  constructor(private playlistsService: PlaylistsService) {}

  @Query(() => [Playlist])
  async playlistsOfUser(@Args('userId', { type: () => Int }) userId: number) {
    return await this.playlistsService.findByUserId({ userId });
  }

  @Query(() => Playlist)
  async playlist(@Args('id', { type: () => Int }) id: number) {
    return await this.playlistsService.findOneById(id);
  }

  @ResolveField()
  async videos(@Parent() playlist: Playlist) {
    return playlist.videos.load({ dataloader: true });
  }

  @Mutation(() => Playlist)
  async createPlaylist(
    @Args('createPlaylistInput') createPlaylistInput: CreatePlaylistInput,
  ) {
    return await this.playlistsService.create(createPlaylistInput);
  }

  @Mutation(() => Playlist)
  async updatePlaylist(
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePlaylistInput') updatePlaylistInput: UpdatePlaylistInput,
  ) {
    return await this.playlistsService.update(id, updatePlaylistInput);
  }
}
