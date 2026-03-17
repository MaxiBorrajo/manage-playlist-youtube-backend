import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { Tool } from '../tools.types';
import { PlaylistRepository } from 'src/features/playlist/repositories/playlist.repository';

export class GetPlaylistsAssociatedWithChatInput {
  userId: number;
  chatId: number;
}

@Injectable()
export class GetPlaylistsAssociatedWithChatToolService extends Tool {
  constructor(private readonly playlistsRepository: PlaylistRepository) {
    super('get_playlists_associated_with_chat');
  }

  async executeTool(
    block: Anthropic.Messages.ToolUseBlock,
    ...args: any[]
  ): Promise<Anthropic.Messages.ToolResultBlockParam> {
    const { userId, chatId } =
      block.input as GetPlaylistsAssociatedWithChatInput;

    const playlists = await this.playlistsRepository.findAll({
      where: {
        author: userId,
        chat: chatId,
      },
    });

    return {
      tool_use_id: block.id,
      type: 'tool_result',
      content: JSON.stringify(playlists),
    };
  }
}
