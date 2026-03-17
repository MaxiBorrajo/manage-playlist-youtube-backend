import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { Tool } from '../tools.types';
import { VideoRepository } from 'src/features/video/video.repository';

export class GetCurrentAssociatedVideosWithChatInput {
  userId: number;
  chatId: number;
}

@Injectable()
export class GetCurrentAssociatedVideosWithChatToolService extends Tool {
  constructor(private readonly videosRepository: VideoRepository) {
    super('get_current_associated_videos_with_chat');
  }

  async executeTool(
    block: Anthropic.Messages.ToolUseBlock,
    ...args: any[]
  ): Promise<Anthropic.Messages.ToolResultBlockParam> {
    const { userId, chatId } =
      block.input as GetCurrentAssociatedVideosWithChatInput;

    const videos = await this.videosRepository.findAll({
      where: {
        chats: {
          id: chatId,
          user: userId,
        },
      },
    });

    return {
      tool_use_id: block.id,
      type: 'tool_result',
      content: JSON.stringify(videos),
    };
  }
}
