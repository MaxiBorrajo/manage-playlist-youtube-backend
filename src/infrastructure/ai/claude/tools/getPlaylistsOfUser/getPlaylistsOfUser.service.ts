import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { Tool } from '../tools.types';
import { PlaylistRepository } from 'src/features/playlist/repositories/playlist.repository';

export class GetPlaylistsOfUserInput {
  userId: number;
}

@Injectable()
export class GetPlaylistsOfUserToolService extends Tool {
  constructor(private readonly playlistsRepository: PlaylistRepository) {
    super('get_playlists_of_user');
  }

  async executeTool(
    block: Anthropic.Messages.ToolUseBlock,
    ...args: any[]
  ): Promise<Anthropic.Messages.ToolResultBlockParam> {
    const { userId } = block.input as GetPlaylistsOfUserInput;

    const playlists = await this.playlistsRepository.findAll({
      where: {
        author: userId,
      },
    });

    return {
      tool_use_id: block.id,
      type: 'tool_result',
      content: JSON.stringify(playlists),
    };
  }
}
