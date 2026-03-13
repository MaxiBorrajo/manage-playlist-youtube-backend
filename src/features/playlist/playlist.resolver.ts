import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Playlist } from './models/playlist.model';
import { PlaylistsService } from './playlist.service';
import { GqlAuthGuard } from '../auth/guards/gqlAuth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/shared/decorators/currentUser.decorator';
import { JwtUser } from '../auth/auth.types';

@UseGuards(GqlAuthGuard)
@Resolver(() => Playlist)
export class PlaylistsResolver {
  constructor(private playlistsService: PlaylistsService) {}

  @Query(() => [Playlist])
  async playlistsOfUser(@CurrentUser() user: JwtUser) {
    return await this.playlistsService.findByUserId({ userId: user.id });
  }

  @Query(() => Playlist)
  async playlist(
    @CurrentUser() user: JwtUser,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return await this.playlistsService.findOneById(id, user.id);
  }

  @ResolveField()
  async items(@Parent() playlist: Playlist) {
    return playlist.items.load({ dataloader: true, populate: ['video'] });
  }
}
