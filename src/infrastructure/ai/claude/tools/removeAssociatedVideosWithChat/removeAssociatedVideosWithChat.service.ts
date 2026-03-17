import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { Tool } from '../tools.types';
import { ChatRepository } from 'src/features/chat/chat.repository';
import { VideoRepository } from 'src/features/video/video.repository';

export class RemoveAssociatedVideosWithChatInput {
  userId: number;
  chatId: number;
  videoId: number;
}

@Injectable()
export class RemoveAssociatedVideosWithChatToolService extends Tool {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly videoRepository: VideoRepository,
  ) {
    super('remove_associated_videos_with_chat');
  }

  async executeTool(
    block: Anthropic.Messages.ToolUseBlock,
    ...args: any[]
  ): Promise<Anthropic.Messages.ToolResultBlockParam> {
    const { userId, chatId, videoId } =
      block.input as RemoveAssociatedVideosWithChatInput;

    const [chat, video] = await Promise.all([
      this.chatRepository.findOneOrFail({
        id: chatId,
        user: userId,
      }),
      this.videoRepository.findOneOrFail({
        id: videoId,
      }),
    ]);

    chat.currentSelection.remove(video);

    return {
      tool_use_id: block.id,
      type: 'tool_result',
      content:
        'Video with ID ' + videoId + ' removed from chat with ID ' + chatId,
    };
  }
}
