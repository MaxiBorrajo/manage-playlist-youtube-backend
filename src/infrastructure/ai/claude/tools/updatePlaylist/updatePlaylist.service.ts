import { Injectable } from '@nestjs/common';
import { PlaylistItemRepository } from 'src/features/playlist/repositories/playlistItem.repository';
import { PlaylistRepository } from 'src/features/playlist/repositories/playlist.repository';
import Anthropic from '@anthropic-ai/sdk';
import { Tool } from '../tools.types';

export class UpdatePlaylistInput {
  id: number;
  name?: string;
  thumbnail?: string;
  description?: string;
  userId: number;
}

@Injectable()
export class UpdatePlaylistToolService extends Tool {
  constructor(
    private readonly playlistRepository: PlaylistRepository,
  ) {
    super('update_playlist');
  }

  async executeTool(
    block: Anthropic.Messages.ToolUseBlock,
    ...args: any[]
  ): Promise<Anthropic.Messages.ToolResultBlockParam> {
    const { id, name, thumbnail, description, userId } =
      block.input as UpdatePlaylistInput;

    const playlist = await this.playlistRepository.findOne({
      id,
      author: userId,
    });

    if (playlist) {
      this.playlistRepository.assign(
        playlist,
        {
          name,
          thumbnail,
          description,
        },
        { ignoreUndefined: true },
      );

      await this.playlistRepository.save(playlist);
    }

    return {
      tool_use_id: block.id,
      type: 'tool_result',
      content: JSON.stringify(playlist),
    };
  }
}
