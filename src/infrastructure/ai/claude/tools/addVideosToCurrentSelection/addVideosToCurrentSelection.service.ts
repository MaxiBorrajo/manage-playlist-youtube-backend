import { Injectable } from '@nestjs/common';
import { PlaylistItemRepository } from 'src/features/playlist/repositories/playlistItem.repository';
import Anthropic from '@anthropic-ai/sdk';
import { Tool } from '../tools.types';
import { PlaylistRepository } from 'src/features/playlist/repositories/playlist.repository';
import { ChatRepository } from 'src/features/chat/chat.repository';
import { VideoRepository } from 'src/features/video/video.repository';

export class AddVideosToCurrentSelectionInput {
  userId: number;
  chatId: number;
  items: {
    videoId: number;
  }[];
}

@Injectable()
export class AddVideosToCurrentSelectionToolService extends Tool {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly videoRepository: VideoRepository,
  ) {
    super('add_videos_to_current_selection');
  }

  async executeTool(
    block: Anthropic.Messages.ToolUseBlock,
    ...args: any[]
  ): Promise<Anthropic.Messages.ToolResultBlockParam> {
    const { userId, chatId, items } =
      block.input as AddVideosToCurrentSelectionInput;

    const chat = await this.chatRepository.findOneOrFail({
      id: chatId,
      user: userId,
    }, {
      populate: ['currentSelection'],
    });

    const videos = await Promise.all(
      items.map((item) =>
        this.videoRepository.findOneOrFail({ id: item.videoId }),
      ),
    );

    chat.currentSelection.add(videos);
    await this.chatRepository.save(chat);

    return {
      tool_use_id: block.id,
      type: 'tool_result',
      content: 'Videos added to current selection with ID ' + chatId,
    };
  }
}
