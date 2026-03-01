import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { Chat } from './models/chat.model';
import { ChatRepository } from './repositories/chat.repository';
import { MessageRepository } from './repositories/message.repository';
import { ClaudeService } from 'src/infrastructure/AI/claude.service';

@Module({
  providers: [
    ChatResolver,
    ChatService,
    ChatRepository,
    MessageRepository,
    ClaudeService,
  ],
})
export class ChatModule {}
