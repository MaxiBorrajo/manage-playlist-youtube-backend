import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gqlAuth.guard';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Message } from './message.model';
import { MessageService } from './message.service';
import { JwtUser } from '../auth/auth.types';
import { CurrentUser } from 'src/shared/decorators/currentUser.decorator';
import { SendMessageInput } from './dto/sendMessage.input';

@UseGuards(GqlAuthGuard)
@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query(() => [Message])
  async getMessagesOfChat(
    @CurrentUser() user: JwtUser,
    @Args('chatId') chatId: number,
  ) {
    return this.messageService.getMessagesOfChat(chatId, user.id);
  }

  @Mutation(() => Message)
  sendMessage(
    @CurrentUser() user: JwtUser,
    @Args('sendMessageInput') sendMessageInput: SendMessageInput,
  ) {
    return this.messageService.sendMessage(sendMessageInput, user.id);
  }

  @ResolveField()
  async chat(@Parent() message: Message) {
    return message.chat
  }
}
