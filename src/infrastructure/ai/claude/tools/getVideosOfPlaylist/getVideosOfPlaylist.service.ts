import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { Tool } from '../tools.types';
import { VideoRepository } from 'src/features/video/video.repository';

export class GetVideosOfPlaylistInput {
  userId: number;
  playlistId: number;
}

@Injectable()
export class GetVideosOfPlaylistToolService extends Tool {
  constructor(private readonly videoRepository: VideoRepository) {
    super('get_videos_of_playlist');
  }

  async executeTool(
    block: Anthropic.Messages.ToolUseBlock,
    ...args: any[]
  ): Promise<Anthropic.Messages.ToolResultBlockParam> {
    const { userId, playlistId } = block.input as GetVideosOfPlaylistInput;

    const videos = await this.videoRepository.findAll({
      where: {
        items: {
          playlist: {
            id: playlistId,
            author: userId,
          },
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
