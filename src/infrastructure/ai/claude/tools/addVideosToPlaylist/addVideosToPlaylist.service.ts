import { Injectable } from '@nestjs/common';
import { PlaylistItemRepository } from 'src/features/playlist/repositories/playlistItem.repository';
import Anthropic from '@anthropic-ai/sdk';
import { Tool } from '../tools.types';
import { PlaylistRepository } from 'src/features/playlist/repositories/playlist.repository';

export class AddVideosToPlaylistInput {
  userId: number;
  playlistId: number;
  videoId: number;
  position: number;
}

@Injectable()
export class AddVideosToPlaylistToolService extends Tool {
  constructor(
    private readonly playlistItemRepository: PlaylistItemRepository,
    private readonly playlistRepository: PlaylistRepository,
  ) {
    super('add_videos_to_playlist');
  }

  async executeTool(
    block: Anthropic.Messages.ToolUseBlock,
    ...args: any[]
  ): Promise<Anthropic.Messages.ToolResultBlockParam> {
    const { userId, playlistId, videoId, position } =
      block.input as AddVideosToPlaylistInput;

    const playlist = await this.playlistRepository.findOneOrFail({
      id: playlistId,
      author: userId,
    });

    const playlistItem = this.playlistItemRepository.create({
      playlist,
      video: videoId,
      position,
    });

    await this.playlistItemRepository.save(playlistItem);

    return {
      tool_use_id: block.id,
      type: 'tool_result',
      content:
        'Video with ID ' + videoId + ' added to playlist with ID ' + playlistId,
    };
  }
}
