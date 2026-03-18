import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { ClaudeService } from 'src/infrastructure/ai/claude/claude.service';
import { SendMessageInput } from './dto/sendMessage.input';
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

    const userContext = `[userId: ${userId}, chatId: ${chat.id}]`;

    const session = await this.claudeService.generateResponse(
      {
        role: 'user',
        content: `${userContext} ${sendMessageInput.prompt}`,
      },
      messagesOfChat.map((message) => ({
        role: message.role === ChatRole.USER ? 'user' : ('assistant' as const),
        content:
          message.role === ChatRole.ASSISTANT && message.metadata
            ? `${message.content}\n[metadata: ${JSON.stringify(message.metadata)}]`
            : message.content,
      })),
    );

    const messagesToCreate = session.map((message) =>
      this.messageRepository.create({
        content: message.message,
        metadata: message.metadata,
        role: message.role === 'user' ? ChatRole.USER : ChatRole.ASSISTANT,
        chat,
      }),
    );
    await this.messageRepository.upsertMany(messagesToCreate, {
      onConflictAction: 'ignore',
    });

    return messagesToCreate[messagesToCreate.length - 1];
  }

  async getMessagesOfChat(chatId: number, userId: number) {
    return this.messageRepository.findAll({
      where: {
        chat: {
          id: chatId,
          user: userId,
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
