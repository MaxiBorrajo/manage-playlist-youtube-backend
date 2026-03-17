import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { Tool } from '../tools.types';
import { MessageRepository } from 'src/features/message/message.repository';

export class SearchMessagesOfChatInput {
  userId: number;
  chatId: number;
  keyword: string;
}

@Injectable()
export class SearchMessagesOfChatToolService extends Tool {
  constructor(private readonly messageRepository: MessageRepository) {
    super('search_messages_of_chat');
  }

  async executeTool(
    block: Anthropic.Messages.ToolUseBlock,
    ...args: any[]
  ): Promise<Anthropic.Messages.ToolResultBlockParam> {
    const { userId, chatId, keyword } =
      block.input as SearchMessagesOfChatInput;

    const messages = await this.messageRepository.find({
      chat: {
        id: chatId,
        user: userId,
      },
      searchableContent: {
        $fulltext: keyword,
      },
    });

    return {
      tool_use_id: block.id,
      type: 'tool_result',
      content: JSON.stringify(messages),
    };
  }
}
