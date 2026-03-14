import { Injectable } from '@nestjs/common';
import { PlaylistItemRepository } from 'src/features/playlist/repositories/playlistItem.repository';
import { PlaylistRepository } from 'src/features/playlist/repositories/playlist.repository';
import Anthropic from '@anthropic-ai/sdk';
import { Tool } from '../tools.types';

export class UpdatePlaylistItemsInput {
  items: {
    playlistId: number;
    videoId: number;
    notes?: string;
    position?: number;
  }[];
}

@Injectable()
export class UpdatePlaylistItemsToolService extends Tool {
  constructor(
    private readonly playlistRepository: PlaylistRepository,
    private readonly playlistItemRepository: PlaylistItemRepository,
  ) {
    super('update_playlist_items');
  }

  async executeTool(
    block: Anthropic.Messages.ToolUseBlock,
    ...args: any[]
  ): Promise<Anthropic.Messages.ToolResultBlockParam> {
    const { items } = block.input as UpdatePlaylistItemsInput;

    const itemsToUpdate = await this.playlistItemRepository.find({
      video: items.map((item) => item.videoId),
      playlist: items.map((item) => item.playlistId),
    });

    for (const item of items) {
      const itemToUpdate = itemsToUpdate.find(
        (i) => i.video.id === item.videoId && i.playlist.id === item.playlistId,
      );

      if (itemToUpdate) {
        this.playlistItemRepository.assign(
          itemToUpdate,
          {
            notes: item.notes,
            position: item.position,
          },
          { ignoreUndefined: true },
        );
      }
    }

    await this.playlistItemRepository.save(itemsToUpdate);

    return {
      tool_use_id: block.id,
      type: 'tool_result',
      content: JSON.stringify(itemsToUpdate),
    };
  }
}
