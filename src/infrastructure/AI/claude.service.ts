import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { ConfigService } from '@nestjs/config';
import { AnthropicException } from './anthropic.exception';

@Injectable()
export class ClaudeService {
  anthropic = new Anthropic({
    apiKey: this.configService.get('CLAUDE_API_KEY'),
  });

  constructor(private readonly configService: ConfigService) {}

  async generateResponse(prompt: string) {
    const msg = await this.anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    this.handleResponse(msg);
  }

  handleResponse(
    msg: Anthropic.Messages.Message & { _request_id?: string | null },
  ) {
    if (msg.stop_reason === 'tool_use') {
      return this.handleToolUse(msg);
    }

    //Claude stopped because it reached the max_tokens limit specified in your request.
    if (msg.stop_reason === 'max_tokens') {
      return this.handleTruncation(msg);
    }

    if (msg.stop_reason === 'model_context_window_exceeded') {
      return this.handleContextLimit(msg);
    }

    //Claude encountered one of your custom stop sequences.
    if (msg.stop_reason === 'pause_turn') {
      return this.handlePause(msg);
    }

    if (msg.stop_reason === 'refusal') {
      return this.handleRefusal(msg);
    }

    return msg.content
  }
}
