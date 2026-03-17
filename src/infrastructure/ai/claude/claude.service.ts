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
    removeAssociatedVideosWithChatTool
  ];

  constructor(
    private readonly configService: ConfigService,
    private readonly toolsExecutionService: ToolsExecutionService,
  ) {}

  async generateResponse(
    newMessage: Anthropic.Messages.MessageParam,
    messages: Anthropic.Messages.MessageParam[],
  ): Promise<PlaylistResponse> {
    //Ver de siempre poder añadir mas contexto a la conversación, y no solo el ultimo mensaje del usuario

    console.log(
      'Messages sent to API:',
      JSON.stringify([...messages, newMessage], null, 2),
    );

    const msg = await this.anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      system: claudeSystem,
      max_tokens: 8000,
      messages: [...messages, newMessage],
      tools: this.tools,
      output_config: { format: zodOutputFormat(PlaylistResponseSchema) },
    });

    return this.handleResponse(msg, messages);
  }

  async handleResponse(
    msg: Anthropic.Messages.Message & { _request_id?: string | null },
    messages: Anthropic.Messages.MessageParam[],
  ): Promise<PlaylistResponse> {
    if (msg.stop_reason === 'tool_use') {
      return this.handleToolUse(msg, messages);
    }

    //Claude stopped because it reached the max_tokens limit specified in your request.
    if (msg.stop_reason === 'max_tokens') {
      return this.handleMaxTokens(msg);
    }

    //Claude encountered one of your custom stop sequences.
    if (msg.stop_reason === 'pause_turn') {
      return await this.handlePause([
        ...messages,
        {
          role: msg.role,
          content: msg.content,
        },
      ]);
    }

    if (msg.stop_reason === 'refusal') {
      return this.handleRefusal(msg);
    }

    if (msg.stop_reason === 'end_turn' && !msg.content) {
      return this.handleEmptyResponse([
        ...messages,
        {
          role: msg.role,
          content: msg.content,
        },
      ]);
    }

    if (msg.stop_reason === 'stop_sequence') {
      console.warn(
        `Claude stopped because it encountered one of your custom stop sequences. Request ID: ${msg._request_id}`,
      );
    }

    return this.handleMessageContent(msg, messages);
  }

  private async handleMessageContent(
    msg: Anthropic.Messages.Message & { _request_id?: string | null },
    messages: Anthropic.Messages.MessageParam[],
  ): Promise<PlaylistResponse> {
    const textBlock = msg.content.find((block) => block.type === 'text');

    let response: PlaylistResponse | { message: undefined; metadata: unknown };

    if (textBlock) {
      try {
        response = PlaylistResponseSchema.parse(JSON.parse(textBlock.text));
      } catch {
        Logger.warn(
          `Failed to parse response JSON, retrying. Raw text: ${textBlock.text.substring(0, 300)}`,
        );
        return await this.handleEmptyResponse([
          ...messages,
          {
            role: msg.role,
            content: msg.content,
          },
        ]);
      }
    } else {
      response = { message: undefined, metadata: msg.content };
    }

    if (response.message === undefined) {
      return await this.handleEmptyResponse([
        ...messages,
        {
          role: msg.role,
          content: msg.content,
        },
      ]);
    }

    return response;
  }

  async handleToolUse(
    msg: Anthropic.Messages.Message & { _request_id?: string | null },
    messages: Anthropic.Messages.MessageParam[],
  ) {
    const toolResults = await this.executeTools(msg.content);

    messages.push({
      role: msg.role,
      content: msg.content,
    });

    return this.generateResponse(
      {
        role: 'user',
        content: toolResults,
      },
      messages,
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
    msg: Anthropic.Messages.Message & { _request_id?: string | null },
  ): never {
    throw new AnthropicRefusalException(msg);
  }

  async handlePause(
    messages: Anthropic.Messages.MessageParam[],
    maxRetries = 5,
  ): Promise<PlaylistResponse> {
    const msg = await this.anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages,
    });

    if (msg.stop_reason !== 'pause_turn') {
      return this.handleResponse(msg, messages);
    }

    if (maxRetries <= 0) {
      return this.handleMessageContent(msg, messages);
    }

    return await this.handlePause(
      [
        ...messages,
        {
          role: msg.role,
          content: msg.content,
        },
      ],
      maxRetries - 1,
    );
  }

  handleMaxTokens(
    msg: Anthropic.Messages.Message & { _request_id?: string | null },
  ): Promise<never> {
    throw new MaxTokensExceededException(msg.usage.output_tokens);
  }

  async handleEmptyResponse(messages: Anthropic.Messages.MessageParam[]) {
    const cleanMessages: Anthropic.Messages.MessageParam[] = [];

    for (const msg of messages) {
      if (typeof msg.content === 'string') {
        cleanMessages.push(msg);
        continue;
      }

      if (!Array.isArray(msg.content)) {
        cleanMessages.push(msg);
        continue;
      }

      const filteredContent = msg.content.filter(
        (block: any) =>
          block.type !== 'tool_use' && block.type !== 'tool_result',
      );

      if (filteredContent.length > 0) {
        cleanMessages.push({ role: msg.role, content: filteredContent });
      }
    }

    return await this.generateResponse(
      {
        role: 'user',
        content: 'Please provide a response to the previous message.',
      },
      cleanMessages,
    );
  }
}
