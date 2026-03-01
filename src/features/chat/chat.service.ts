import { Injectable } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatRepository } from './repositories/chat.repository';
import { MessageRepository } from './repositories/message.repository';
import { ClaudeService } from 'src/infrastructure/AI/claude.service';
import { ChatRole } from './chat.types';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly messageRepository: MessageRepository,
    private readonly claudeService: ClaudeService,
  ) {}

  async create(createChatInput: CreateChatInput, userId: number) {
    this.claudeService.generateResponse(createChatInput.prompt)
    // const chat = this.chatRepository.create({ name: 'Untitled', user: userId });
    // const [response] = await Promise.all([
    // //   this.claudeService.generateResponse(createChatInput.prompt),
    //   this.chatRepository.save(chat),
    // ]);

    // await this.messageRepository.save(
    //   [this.messageRepository.create({
    //     content: createChatInput.prompt,
    //     role: ChatRole.USER,
    //     chat,
    //   }),
    //   this.messageRepository.create({
    //     content: response,
    //     role: ChatRole.ASSISTANT,
    //     chat,
    //   })],
    // );
  }

  findAll(userId: number) {
    return `This action returns all chat for user ${userId}`;
  }

  findOne(id: number, userId: number) {
    return `This action returns a #${id} chat for user ${userId}`;
  }

  update(id: number, updateChatInput: UpdateChatInput, userId: number) {
    return `This action updates a #${id} chat for user ${userId}`;
  }

  remove(id: number, userId: number) {
    return `This action removes a #${id} chat for user ${userId}`;
  }
}
