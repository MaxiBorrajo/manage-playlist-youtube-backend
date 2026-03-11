import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { ClaudeService } from 'src/infrastructure/ai/claude/claude.service';
import { SendMessageInput } from './dto/sendMessage.input';
import { ChatRepository } from '../chat/chat.repository';
import { ChatService } from '../chat/chat.service';
import { ChatRole } from '../chat/chat.types';
import { Transactional } from '@mikro-orm/core';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly chatService: ChatService,
    private readonly claudeService: ClaudeService,
  ) {}

  @Transactional()
  async sendMessage(sendMessageInput: SendMessageInput, userId: number) {
    const chat = sendMessageInput.chatId
      ? await this.chatService.findOne(sendMessageInput.chatId, userId)
      : await this.chatService.create(sendMessageInput.prompt, userId);

    const messagesOfChat = await this.getMessagesOfChat(chat.id, userId);

    const { message, metadata } = await this.claudeService.generateResponse(
      {
        role: 'user',
        content: sendMessageInput.prompt,
      },
      messagesOfChat.map((message) => ({
        role: message.role === ChatRole.USER ? 'user' : 'assistant',
        content: message.content,
      })),
    );

    const userMessage = this.messageRepository.create({
      content: sendMessageInput.prompt,
      role: ChatRole.USER,
      chat,
    });

    const assistantMessage = this.messageRepository.create({
      content: message,
      metadata,
      role: ChatRole.ASSISTANT,
      chat,
    });

    await this.messageRepository.save([userMessage, assistantMessage]);

    return assistantMessage;
  }

  async getMessagesOfChat(chatId: number, userId: number) {
    return this.messageRepository.findAll({
      where: {
        chat: {
          id: chatId,
          user: userId,
        },
      },
    });
  }
}
