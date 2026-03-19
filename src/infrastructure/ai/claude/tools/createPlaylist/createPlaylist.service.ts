import { Injectable } from '@nestjs/common';
import { PlaylistItemRepository } from 'src/features/playlist/repositories/playlistItem.repository';
import { PlaylistRepository } from 'src/features/playlist/repositories/playlist.repository';
import Anthropic from '@anthropic-ai/sdk';
import { Tool } from '../tools.types';
import { ChatRepository } from 'src/features/chat/chat.repository';

export class CreatePlaylistInput {
  name: string;
  thumbnail?: string;
  description?: string;
  userId: number;
  chatId: number;
  items: {
    videoId: number;
    notes?: string;
    position: number;
  }[];
}

@Injectable()
export class CreatePlaylistToolService extends Tool {
  constructor(
    private readonly playlistRepository: PlaylistRepository,
    private readonly playlistItemRepository: PlaylistItemRepository,
    private readonly chatRepository: ChatRepository,
  ) {
    super('create_playlist');
  }

  async executeTool(
    block: Anthropic.Messages.ToolUseBlock,
    ...args: any[]
  ): Promise<Anthropic.Messages.ToolResultBlockParam> {
    const { name, thumbnail, description, items, userId, chatId } =
      block.input as CreatePlaylistInput;

    const playlist = this.playlistRepository.create({
      name,
      thumbnail,
      description,
      author: userId,
      chat: chatId,
    });

    await this.playlistRepository.save(playlist);

    const itemsToCreate = items.map((item) =>
      this.playlistItemRepository.create({
        video: item.videoId,
        notes: item.notes,
        position: item.position,
        playlist: playlist.id,
      }),
    );

    playlist.items.add(itemsToCreate);
    await this.playlistRepository.save(playlist);

    const chat = await this.chatRepository.findOneOrFail(
      {
        id: chatId,
      },
      {
        populate: ['playlistsCreated', 'currentSelection'],
      },
    );

    chat.playlistsCreated.add(playlist);
    chat.currentSelection.removeAll();

    await this.chatRepository.save(chat);

    return {
      tool_use_id: block.id,
      type: 'tool_result',
      content: JSON.stringify(playlist),
    };
  }
}
