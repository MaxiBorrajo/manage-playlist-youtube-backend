import { Injectable } from '@nestjs/common';
import { PlaylistItemRepository } from 'src/features/playlist/repositories/playlistItem.repository';
import { PlaylistRepository } from 'src/features/playlist/repositories/playlist.repository';
import Anthropic from '@anthropic-ai/sdk';
import { Tool } from '../tools.types';
import { MessageRepository } from 'src/features/message/message.repository';
import { Playlist } from 'src/features/playlist/models/playlist.model';
import { Video } from 'src/features/video/video.model';
import { ChatRepository } from 'src/features/chat/chat.repository';

export class SearchMessagesOfChatInput {
  userId: number;
  keyword?: string;
}

@Injectable()
export class SearchChatsOfUserToolService extends Tool {
  constructor(private readonly chatRepository: ChatRepository) {
    super('search_chats_of_user');
  }

  async executeTool(
    block: Anthropic.Messages.ToolUseBlock,
    ...args: any[]
  ): Promise<Anthropic.Messages.ToolResultBlockParam> {
    const { userId, keyword } = block.input as SearchMessagesOfChatInput;

    const chats = await this.chatRepository.find({
      user: userId,
      searchableName: {
        $fulltext: keyword,
      },
    });

    return {
      tool_use_id: block.id,
      type: 'tool_result',
      content: JSON.stringify(chats),
    };
  }
}
