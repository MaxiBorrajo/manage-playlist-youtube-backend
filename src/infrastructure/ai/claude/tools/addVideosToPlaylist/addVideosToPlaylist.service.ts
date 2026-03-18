import { Injectable } from '@nestjs/common';
import { PlaylistItemRepository } from 'src/features/playlist/repositories/playlistItem.repository';
import Anthropic from '@anthropic-ai/sdk';
import { Tool } from '../tools.types';
import { PlaylistRepository } from 'src/features/playlist/repositories/playlist.repository';

export class AddVideosToPlaylistInput {
  userId: number;
  playlistId: number;
  items: {
    videoId: number;
    notes?: string;
    position: number;
  }[];
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
    const { userId, playlistId, items } = block.input as AddVideosToPlaylistInput;

    const playlist = await this.playlistRepository.findOneOrFail({
      id: playlistId,
      author: userId,
    });

    const playlistItems = items.map((item) => {
      return this.playlistItemRepository.create({
        playlist,
        video: item.videoId,
        position: item.position,
        notes: item.notes,
      });
    });

    await this.playlistItemRepository.save(playlistItems);

    return {
      tool_use_id: block.id,
      type: 'tool_result',
      content:
        'Videos added to playlist with ID ' + playlistId,
    };
  }
}
