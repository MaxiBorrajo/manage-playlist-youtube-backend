import { forwardRef, Module } from '@nestjs/common';
import { AiModule } from 'src/infrastructure/ai/ai.module';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [AiModule, forwardRef(() => ChatModule)],
  providers: [MessageResolver, MessageService, MessageRepository],
  exports: [MessageService, MessageRepository],
})
export class MessageModule {}
