import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { Chat } from './models/chat.model';
import { JwtUser } from '../auth/auth.types';
import { CurrentUser } from 'src/shared/decorators/currentUser.decorator';
import { GqlAuthGuard } from '../auth/guards/gqlAuth.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(GqlAuthGuard)
@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Mutation(() => [Chat])
  async createChat(
    @CurrentUser() user: JwtUser,
    @Args('createChatInput') createChatInput: CreateChatInput,
  ) {
    await this.chatService.create(createChatInput, user.id);
    return []
  }

  @Query(() => [Chat])
  chats(@CurrentUser() user: JwtUser) {
    return this.chatService.findAll(user.id);
  }

  @Query(() => Chat)
  chat(
    @CurrentUser() user: JwtUser,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.chatService.findOne(id, user.id);
  }

  @Mutation(() => Chat)
  updateChat(
    @CurrentUser() user: JwtUser,
    @Args('id', { type: () => Int }) id: number,
    @Args('updateChatInput') updateChatInput: UpdateChatInput,
  ) {
    return this.chatService.update(id, updateChatInput, user.id);
  }

  @Mutation(() => Chat)
  removeChat(
    @CurrentUser() user: JwtUser,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.chatService.remove(id, user.id);
  }
}
