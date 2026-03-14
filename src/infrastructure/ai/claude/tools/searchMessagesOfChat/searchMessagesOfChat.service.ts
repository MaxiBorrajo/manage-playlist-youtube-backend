import { Injectable } from '@nestjs/common';
import { PlaylistItemRepository } from 'src/features/playlist/repositories/playlistItem.repository';
import { PlaylistRepository } from 'src/features/playlist/repositories/playlist.repository';
import Anthropic from '@anthropic-ai/sdk';
import { Tool } from '../tools.types';
import { MessageRepository } from 'src/features/message/message.repository';
import { Playlist } from 'src/features/playlist/models/playlist.model';
import { Video } from 'src/features/video/video.model';

export class SearchMessagesOfChatInput {
  userId: number;
  chatId: number;
  keyword: string;
  metadata: {
    videos?: Video[];
    playlist: Playlist;
  };
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
    const { userId, chatId, keyword, metadata } =
      block.input as SearchMessagesOfChatInput;

    const messages = await this.messageRepository.find({
      chat: {
        id: chatId,
        user: userId,
      },
      content: {
        $fulltext: keyword,
      },
      metadata,
    });

    return {
      tool_use_id: block.id,
      type: 'tool_result',
      content: JSON.stringify(messages),
    };
  }
}
