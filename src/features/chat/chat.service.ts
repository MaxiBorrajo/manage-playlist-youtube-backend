import { Injectable } from '@nestjs/common';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatRepository } from './chat.repository';
import { MessageRepository } from '../message/message.repository';
import { Transactional } from '@mikro-orm/core';
import { ClaudeService } from 'src/infrastructure/ai/claude/claude.service';
import { Chat } from './chat.model';
import { ChatRole } from './chat.types';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly messageRepository: MessageRepository,
  ) {}

  @Transactional()
  async create(prompt: string, userId: number) {
    const chat = this.chatRepository.create({
      name: prompt.substring(0, 50),
      user: userId,
    });

    await this.createInitialMessage(chat, userId);

    return chat;
  }

  async createInitialMessage(chat: Chat, userId: number) {
    const totalChats = await this.chatRepository.count({ user: userId });

    if (totalChats === 1) {
      const welcomeMessage = `¡Hola! Soy tu asistente de PlaylistAI. Estoy aca para ayudarte a descubrir videos de YouTube y armar playlists personalizadas.\n\nAsi funciona: pedime que busque videos sobre cualquier tema (ej: "busca tutoriales de guitarra" o "quiero videos de recetas faciles"). Te voy a mostrar los mejores resultados y vos elegis cuales te gustan.\n\nLos videos que elijas se van guardando en una seleccion temporal. Cuando estes listo, pedime que arme una playlist y la creo al toque con los videos que seleccionaste.\n\nTambien puedo ayudarte a gestionar tus playlists: agregar o sacar videos, reordenarlos, cambiar nombres, o buscar en conversaciones anteriores. Pedime lo que necesites y arrancamos.`;

      const initialMessage = this.messageRepository.create({
        content: welcomeMessage,
        role: ChatRole.ASSISTANT,
        chat,
      });

      await this.messageRepository.save(initialMessage);
    }
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
