import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from './user.model';
import { UsersService } from './user.service';
import { UpdateUserInput } from './dto/updateUser.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gqlAuth.guard';
import { CurrentUser } from 'src/shared/decorators/currentUser.decorator';

@UseGuards(GqlAuthGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(() => User)
  async updateUser(
    @CurrentUser() user: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return await this.usersService.update(user.id, updateUserInput);
  }

  @Query(() => User)
  async user(@Args('id', { type: () => Int }) id: number) {
    return await this.usersService.findOneById(id);
  }

  @Query(() => User)
  async me(@CurrentUser() user: User) {
    return await this.usersService.findOneById(user.id);
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
