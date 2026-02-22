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
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.usersService.create(createUserInput);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return await this.usersService.update(id, updateUserInput);
  }

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
