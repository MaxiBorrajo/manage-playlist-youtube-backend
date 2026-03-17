import { Injectable } from '@nestjs/common';
import { PlaylistItemRepository } from 'src/features/playlist/repositories/playlistItem.repository';
import Anthropic from '@anthropic-ai/sdk';
import { Tool } from '../tools.types';

export class RemoveVideosFromPlaylistInput {
  userId: number;
  playlistId: number;
  videoId: number;
}

@Injectable()
export class RemoveVideosFromPlaylistToolService extends Tool {
  constructor(private readonly playlistItemRepository: PlaylistItemRepository) {
    super('remove_videos_from_playlist');
  }

  async executeTool(
    block: Anthropic.Messages.ToolUseBlock,
    ...args: any[]
  ): Promise<Anthropic.Messages.ToolResultBlockParam> {
    const { userId, playlistId, videoId } =
      block.input as RemoveVideosFromPlaylistInput;

    const playlistItem = await this.playlistItemRepository.findOneOrFail({
      video: videoId,
      playlist: {
        id: playlistId,
        author: userId,
      },
    });

    await this.playlistItemRepository.remove(playlistItem);

    return {
      tool_use_id: block.id,
      type: 'tool_result',
      content:
        'Video with ID ' +
        videoId +
        ' removed from playlist with ID ' +
        playlistId,
    };
  }
}
