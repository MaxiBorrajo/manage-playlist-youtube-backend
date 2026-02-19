import { Args, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { User } from "./user.model";
import { UsersService } from "./user.service";
import { PlaylistsService } from "../playlists/playlist.service";

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private playlistsService: PlaylistsService,
  ) {}

  @Query(() => User)
  async user(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOneById(id);
  }

  @ResolveField()
  async playlists(@Parent() user: User) {
    const { id } = user;
    return this.playlistsService.findAll({ userId: id });
  }
}
