import { Injectable, Logger } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { ConfigService } from '@nestjs/config';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { ToolResultBlockParam } from '@anthropic-ai/sdk/resources';
import { PlaylistResponse, PlaylistResponseSchema } from './claude.types';
import { AnthropicRefusalException } from './exceptions/anthropicRefusal.exception';
import { MaxTokensExceededException } from './exceptions/maxTokensExceeded.exception';
import { claudeSystem } from './claude.constants';
import { ToolsExecutionService } from './tools/toolsExecution.service';
import { createPlaylistTool } from './tools/createPlaylist/createPlaylist.constants';
import { searcherTool } from './tools/searcher/searcher.constants';
import { updatePlaylistItemTool } from './tools/updatePlaylistItems/updatePlaylistItems.constants';
import { updatePlaylistTool } from './tools/updatePlaylist/updatePlaylist.constants';
import { searchMessagesOfChatTool } from './tools/searchMessagesOfChat/searchMessagesOfChat.constants';
import { searchChatsOfUserTool } from './tools/searchChatsOfUser/searchChatsOfUser.constants';
import { removeVideosFromPlaylistTool } from './tools/removeVideosFromPlaylist/removeVideosFromPlaylist.constants';
import { removePlaylistTool } from './tools/removePlaylist/removePlaylist.constants';
import { getVideosOfPlaylistTool } from './tools/getVideosOfPlaylist/getVideosOfPlaylist.constants';
import { getPlaylistsOfUserTool } from './tools/getPlaylistsOfUser/getPlaylistsOfUser.constants';
import { getPlaylistsAssociatedWithChatTool } from './tools/getPlaylistsAssociatedWithChat/getPlaylistsAssociatedWithChat.constants';
import { getCurrentAssociatedVideosWithChatTool } from './tools/getCurrentAssociatedVideosWithChat/getCurrentAssociatedVideosWithChat.constants';
import { addVideosToPlaylistTool } from './tools/addVideosToPlaylist/addVideosToPlaylist.constants';
import { removeAssociatedVideosWithChatTool } from './tools/removeAssociatedVideosWithChat/removeAssociatedVideosWithChat.constants';

@Injectable()
export class ClaudeService {
  anthropic: Anthropic = new Anthropic({
    apiKey: this.configService.get('CLAUDE_API_KEY'),
  });

  tools: Anthropic.Tool[] = [
    searcherTool,
    createPlaylistTool,
    updatePlaylistItemTool,
    searchMessagesOfChatTool,
    updatePlaylistTool,
    searchChatsOfUserTool,
    removeVideosFromPlaylistTool,
    removePlaylistTool,
    getVideosOfPlaylistTool,
    getPlaylistsOfUserTool,
    getPlaylistsAssociatedWithChatTool,
    getCurrentAssociatedVideosWithChatTool,
    addVideosToPlaylistTool,
    removeAssociatedVideosWithChatTool,
  ];

  constructor(
    private readonly configService: ConfigService,
    private readonly toolsExecutionService: ToolsExecutionService,
  ) {}

  async generateResponse(
    newMessage: Anthropic.Messages.MessageParam,
    messages: Anthropic.Messages.MessageParam[],
  ): Promise<(PlaylistResponse & { role: string })[]> {
    //Ver de siempre poder añadir mas contexto a la conversación, y no solo el ultimo mensaje del usuario

    console.log(
      'Messages sent to API:',
      JSON.stringify([...messages, newMessage], null, 2),
    );

    const session = [...messages, newMessage];

    const aiResponse = await this.anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      system: claudeSystem,
      max_tokens: 8000,
      messages: session,
      tools: this.tools,
      output_config: { format: zodOutputFormat(PlaylistResponseSchema) },
    });

    return this.handleResponse(aiResponse, session);
  }

  async handleResponse(
    aiResponse: Anthropic.Messages.Message & { _request_id?: string | null },
    session: Anthropic.Messages.MessageParam[],
  ): Promise<PlaylistResponse[]> {
    if (aiResponse.stop_reason === 'tool_use') {
      return this.handleToolUse(aiResponse, session);
    }

    //Claude stopped because it reached the max_tokens limit specified in your request.
    if (aiResponse.stop_reason === 'max_tokens') {
      return this.handleMaxTokens(aiResponse);
    }

    //Claude encountered one of your custom stop sequences.
    if (aiResponse.stop_reason === 'pause_turn') {
      return await this.handlePause([
        ...session,
        {
          role: aiResponse.role,
          content: aiResponse.content,
        },
      ]);
    }

    if (aiResponse.stop_reason === 'refusal') {
      return this.handleRefusal(aiResponse);
    }

    if (aiResponse.stop_reason === 'end_turn' && !aiResponse.content) {
      return this.handleEmptyResponse([
        ...session,
        {
          role: aiResponse.role,
          content: aiResponse.content,
        },
      ]);
    }

    if (aiResponse.stop_reason === 'stop_sequence') {
      console.warn(
        `Claude stopped because it encountered one of your custom stop sequences. Request ID: ${aiResponse._request_id}`,
      );
    }

    return this.handleMessageContent(aiResponse, session);
  }

  private async handleMessageContent(
    aiResponse: Anthropic.Messages.Message & { _request_id?: string | null },
    session: Anthropic.Messages.MessageParam[],
  ): Promise<PlaylistResponse[]> {
    const textBlock = aiResponse.content.find((block) => block.type === 'text');
    const textBlocks = session
      .map(
        (message) => message.content as Anthropic.Messages.ContentBlockParam[],
      )
      .flatMap((content) => content.filter((block) => block.type === 'text'));

    const responses: (
      | PlaylistResponse
      | { message: undefined; metadata: unknown }
    )[] = [];

    const allTextBlocks = [...textBlocks, ...(textBlock ? [textBlock] : [])];

    for (const block of allTextBlocks) {
      if (block) {
        try {
          responses.push(PlaylistResponseSchema.parse(JSON.parse(block.text)));
        } catch {
          Logger.warn(
            `Failed to parse response JSON, retrying. Raw text: ${block.text.substring(0, 300)}`,
          );
          return await this.handleEmptyResponse([
            ...session,
            {
              role: aiResponse.role,
              content: aiResponse.content,
            },
          ]);
        }
      } else {
        responses.push({ message: undefined, metadata: aiResponse.content });
      }
    }

    for (const response of responses) {
      if (response.message === undefined) {
        return await this.handleEmptyResponse([
          ...session,
          {
            role: aiResponse.role,
            content: aiResponse.content,
          },
        ]);
      }
    }

    return responses.map((response) => response as PlaylistResponse);
  }

  async handleToolUse(
    aiResponse: Anthropic.Messages.Message & { _request_id?: string | null },
    session: Anthropic.Messages.MessageParam[],
  ) {
    const toolResults = await this.executeTools(aiResponse.content);

    session.push({
      role: aiResponse.role,
      content: aiResponse.content,
    });

    return this.generateResponse(
      {
        role: 'user',
        content: toolResults,
      },
      session,
    );
  }

  async executeTools(
    content: Anthropic.Messages.ContentBlock[],
  ): Promise<string | Anthropic.Messages.ContentBlockParam[]> {
    const toolsResults: ToolResultBlockParam[] =
      await this.toolsExecutionService.execute(content);

    return toolsResults;
  }

  handleRefusal(
    aiResponse: Anthropic.Messages.Message & { _request_id?: string | null },
  ): never {
    throw new AnthropicRefusalException(aiResponse);
  }

  async handlePause(
    session: Anthropic.Messages.MessageParam[],
    maxRetries = 5,
  ): Promise<PlaylistResponse[]> {
    const aiResponse = await this.anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages: session,
    });

    if (aiResponse.stop_reason !== 'pause_turn') {
      return this.handleResponse(aiResponse, session);
    }

    if (maxRetries <= 0) {
      return this.handleMessageContent(aiResponse, session);
    }

    return await this.handlePause(
      [
        ...session,
        {
          role: aiResponse.role,
          content: aiResponse.content,
        },
      ],
      maxRetries - 1,
    );
  }

  handleMaxTokens(
    aiResponse: Anthropic.Messages.Message & { _request_id?: string | null },
  ): Promise<never> {
    throw new MaxTokensExceededException(aiResponse.usage.output_tokens);
  }

  async handleEmptyResponse(session: Anthropic.Messages.MessageParam[]) {
    return await this.generateResponse(
      {
        role: 'user',
        content: 'Please provide a response to the previous message.',
      },
      session,
    );
  }
}
