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
import { GqlAuthGuard } from '../auth/guards/gqlAuth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/shared/decorators/currentUser.decorator';
import { User } from '../users/user.model';

@UseGuards(GqlAuthGuard)
@Resolver(() => Playlist)
export class PlaylistsResolver {
  constructor(private playlistsService: PlaylistsService) {}

  @Query(() => [Playlist])
  async playlistsOfUser(@CurrentUser() user: User) {
    return await this.playlistsService.findByUserId({ userId: user.id });
  }

  @Query(() => Playlist)
  async playlist(@CurrentUser() user: User, @Args('id', { type: () => Int }) id: number) {
    return await this.playlistsService.findOneById(id, user.id);
  }

  @ResolveField()
  async videos(@Parent() playlist: Playlist) {
    return playlist.videos.load({ dataloader: true });
  }

  @Mutation(() => Playlist)
  async createPlaylist(
    @CurrentUser() user: User,
    @Args('createPlaylistInput') createPlaylistInput: CreatePlaylistInput,
  ) {
    return await this.playlistsService.create(createPlaylistInput, user.id);
  }

  @Mutation(() => Playlist)
  async updatePlaylist(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePlaylistInput') updatePlaylistInput: UpdatePlaylistInput,
  ) {
    return await this.playlistsService.update(id, updatePlaylistInput, user.id);
  }
}
