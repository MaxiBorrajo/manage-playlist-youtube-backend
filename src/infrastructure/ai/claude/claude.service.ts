import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { ConfigService } from '@nestjs/config';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { ToolResultBlockParam } from '@anthropic-ai/sdk/resources';
import { PlaylistResponseSchema } from './claude.types';
import { AnthropicRefusalException } from './exceptions/anthropicRefusal.exception';
import { MaxTokensExceededException } from './exceptions/maxTokensExceeded.exception';
import { claudeSystem } from './claude.constants';
import { searcherTool } from 'src/infrastructure/searcher/searcher.constants';
import { ToolsExecutionService } from './toolsExecution.service';

@Injectable()
export class ClaudeService {
  anthropic: Anthropic = new Anthropic({
    apiKey: this.configService.get('CLAUDE_API_KEY'),
  });

  tools: Anthropic.Tool[] = [searcherTool];

  constructor(
    private readonly configService: ConfigService,
    private readonly toolsExecutionService: ToolsExecutionService,
  ) {}

  async generateResponse(
    newMessage: Anthropic.Messages.MessageParam,
    messages: Anthropic.Messages.MessageParam[],
  ): Promise<string | Anthropic.Messages.ContentBlockParam[]> {
    //Ver de siempre poder añadir mas contexto a la conversación, y no solo el ultimo mensaje del usuario

    const msg = await this.anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      system: claudeSystem,
      max_tokens: 2500,
      messages: [...messages, newMessage],
      tools: this.tools,
      output_config: { format: zodOutputFormat(PlaylistResponseSchema) },
    });

    return this.handleResponse(msg, messages);
  }

  async handleResponse(
    msg: Anthropic.Messages.Message & { _request_id?: string | null },
    messages: Anthropic.Messages.MessageParam[],
  ): Promise<string | Anthropic.Messages.ContentBlockParam[]> {
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

    return this.handleMessageContent(msg);
  }

  private handleMessageContent(
    msg: Anthropic.Messages.Message & { _request_id?: string | null },
  ) {
    const textBlock = msg.content.find((block) => block.type === 'text');
    return textBlock ? JSON.parse(textBlock.text) : msg.content;
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
  ): Promise<string | Anthropic.Messages.ContentBlockParam[]> {
    const msg = await this.anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages,
    });

    if (msg.stop_reason !== 'pause_turn') {
      return this.handleResponse(msg, messages);
    }

    if (maxRetries <= 0) {
      return this.handleMessageContent(msg);
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
    return await this.generateResponse(
      {
        role: 'user',
        content: 'Please provide a response to the previous message.',
      },
      messages,
    );
  }
}
