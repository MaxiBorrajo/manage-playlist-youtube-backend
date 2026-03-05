import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { Chat } from './models/chat.model';
import { ChatRepository } from './repositories/chat.repository';
import { MessageRepository } from './repositories/message.repository';
import { AiModule } from 'src/infrastructure/ai/ai.module';

@Module({
  imports: [AiModule],
  providers: [
    ChatResolver,
    ChatService,
    ChatRepository,
    MessageRepository,
  ],
})
export class ChatModule {}
