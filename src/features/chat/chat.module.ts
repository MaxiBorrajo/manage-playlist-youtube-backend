import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { ChatRepository } from './chat.repository';
import { MessageModule } from '../message/message.module';
import { AiModule } from 'src/infrastructure/ai/ai.module';

@Module({
  imports: [forwardRef(() => MessageModule)],
  providers: [ChatResolver, ChatService, ChatRepository],
  exports: [ChatService, ChatRepository],
})
export class ChatModule {}
