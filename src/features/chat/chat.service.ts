import { Injectable } from '@nestjs/common';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatRepository } from './chat.repository';
import { ClaudeService } from 'src/infrastructure/ai/claude.service';
import { MessageRepository } from '../message/message.repository';
import { ChatRole } from './chat.types';
import { string } from 'zod';
import { Transactional } from '@mikro-orm/core';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly messageRepository: MessageRepository,
    private readonly claudeService: ClaudeService,
  ) {}

  @Transactional()
  async create(prompt:string, userId: number) {
    const chat = this.chatRepository.create({
      name: prompt.substring(0, 50),
      user: userId,
    });

    return chat;
  }

  findAll(userId: number) {
    return `This action returns all chat for user ${userId}`;
  }

  async findOne(id: number, userId: number) {
    return this.chatRepository.findOneOrFail({ id, user: userId });
  }

  update(id: number, updateChatInput: UpdateChatInput, userId: number) {
    return `This action updates a #${id} chat for user ${userId}`;
  }

  remove(id: number, userId: number) {
    return `This action removes a #${id} chat for user ${userId}`;
  }
}
