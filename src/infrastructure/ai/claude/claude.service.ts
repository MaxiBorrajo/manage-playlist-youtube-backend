import { Injectable, Logger } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { ConfigService } from '@nestjs/config';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { ToolResultBlockParam } from '@anthropic-ai/sdk/resources';
import {
  PlaylistResponseSchema,
  PlaylistResponseWithRole,
} from './claude.types';
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
import { addVideosToCurrentSelectionTool } from './tools/addVideosToCurrentSelection/addVideosToCurrentSelection.constants';

@Injectable()
export class ClaudeService {
  anthropic: Anthropic = new Anthropic({
    apiKey: this.configService.get('CLAUDE_API_KEY'),
    maxRetries: 10,
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
    addVideosToCurrentSelectionTool,
  ];

  constructor(
    private readonly configService: ConfigService,
    private readonly toolsExecutionService: ToolsExecutionService,
  ) {}

  private static readonly MAX_TOOL_ROUNDS = 10;

  async generateResponse(
    newMessage: Anthropic.Messages.MessageParam,
    messages: Anthropic.Messages.MessageParam[],
    toolRound = 0,
  ): Promise<PlaylistResponseWithRole[]> {
    console.log(
      'Messages sent to API:',
      JSON.stringify([...messages, newMessage], null, 2),
    );

    const session = [...messages, newMessage];

    const aiResponse = await this.anthropic.messages.create(
      this.generateMessageConfig(session),
    );

    return this.handleResponse(aiResponse, session, toolRound);
  }

  private generateMessageConfig(
    session: Anthropic.Messages.MessageParam[],
  ): Anthropic.Messages.MessageCreateParamsNonStreaming {
    return {
      model: 'claude-haiku-4-5-20251001',
      system: claudeSystem,
      max_tokens: 8000,
      messages: session,
      tools: this.tools,
      output_config: { format: zodOutputFormat(PlaylistResponseSchema) },
    };
  }

  async handleResponse(
    aiResponse: Anthropic.Messages.Message & { _request_id?: string | null },
    session: Anthropic.Messages.MessageParam[],
    toolRound = 0,
  ): Promise<PlaylistResponseWithRole[]> {
    if (aiResponse.stop_reason === 'tool_use') {
      if (toolRound >= ClaudeService.MAX_TOOL_ROUNDS) {
        console.warn(
          `Max tool rounds (${ClaudeService.MAX_TOOL_ROUNDS}) reached, forcing text response`,
        );
        return this.handleMessageContent(aiResponse, session);
      }
      return this.handleToolUse(aiResponse, session, toolRound);
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
  ): Promise<PlaylistResponseWithRole[]> {
    const textBlock = aiResponse.content.find((block) => block.type === 'text');

    if (textBlock && textBlock.type === 'text') {
      console.log('Raw AI response text:', textBlock.text);

      // Fix trailing commas that Haiku sometimes generates (e.g. ",}" or ",]")
      const sanitized = textBlock.text.replace(/,\s*([}\]])/g, '$1');
      if (sanitized !== textBlock.text) {
        console.warn('Fixed trailing commas in AI response');
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(sanitized);
      } catch (e) {
        console.error(
          'Failed to parse JSON from AI response:',
          (e as Error).message,
        );
        console.error('Raw text:', textBlock.text);
        throw new Error('AI response is not valid JSON');
      }

      console.log('Parsed AI response:', JSON.stringify(parsed, null, 2));
      const validated = PlaylistResponseSchema.safeParse(parsed);

      if (!validated.success) {
        console.warn(
          `Failed to validate AI response content. Request ID: ${aiResponse._request_id}`,
          {
            error: validated.error,
            rawContent: textBlock.text,
          },
        );
        return this.handleEmptyResponse([
          ...session,
          {
            role: aiResponse.role,
            content: aiResponse.content,
          },
        ]);
      }

      const newMessage = {
        ...validated.data,
        role: 'assistant' as 'assistant' | 'user',
      };

      const messages = session
        .filter((message) => {
          return !Array.isArray(message.content);
        })
        .map((message) => {
          return {
            role: message.role,
            message: message.content as string,
            metadata: {},
          };
        });

      return [...messages, newMessage];
    }

    return this.handleEmptyResponse([
      ...session,
      {
        role: aiResponse.role,
        content: aiResponse.content,
      },
    ]);
  }

  async handleToolUse(
    aiResponse: Anthropic.Messages.Message & { _request_id?: string | null },
    session: Anthropic.Messages.MessageParam[],
    toolRound = 0,
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
      toolRound + 1,
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
  ): Promise<PlaylistResponseWithRole[]> {
    const aiResponse = await this.anthropic.messages.create(
      this.generateMessageConfig(session),
    );

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
