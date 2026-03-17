import { Injectable } from '@nestjs/common';
import { PlaylistItemRepository } from 'src/features/playlist/repositories/playlistItem.repository';
import Anthropic from '@anthropic-ai/sdk';
import { Tool } from '../tools.types';
import { PlaylistRepository } from 'src/features/playlist/repositories/playlist.repository';

export class RemovePlaylistInput {
  userId: number;
  playlistId: number;
}

@Injectable()
export class RemovePlaylistToolService extends Tool {
  constructor(private readonly playlistRepository: PlaylistRepository) {
    super('remove_playlist');
  }

  async executeTool(
    block: Anthropic.Messages.ToolUseBlock,
    ...args: any[]
  ): Promise<Anthropic.Messages.ToolResultBlockParam> {
    const { userId, playlistId } = block.input as RemovePlaylistInput;

    const playlist = await this.playlistRepository.findOneOrFail({
      id: playlistId,
      author: userId,
    });

    await this.playlistRepository.remove(playlist);

    return {
      tool_use_id: block.id,
      type: 'tool_result',
      content: 'Playlist with ID ' + playlistId + ' removed.',
    };
  }
}
