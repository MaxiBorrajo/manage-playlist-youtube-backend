import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from './user.model';
import { UsersService } from './user.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
  ) {}

  @Query(() => User)
  async user(@Args('id', { type: () => Int }) id: number) {
    return await this.usersService.findOneById(id);
  }

  @ResolveField()
  async createdPlaylists(@Parent() user: User) {
    return user.createdPlaylists.load({ dataloader: true });
  }

  @ResolveField()
  async savedPlaylists(@Parent() user: User) {
    return user.savedPlaylists.load({ dataloader: true });
  }
}
