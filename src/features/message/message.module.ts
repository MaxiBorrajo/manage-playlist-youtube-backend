import { forwardRef, Module } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { ChatModule } from '../chat/chat.module';
import { ClaudeModule } from 'src/infrastructure/ai/claude/claude.module';

@Module({
  imports: [ClaudeModule, forwardRef(() => ChatModule)],
  providers: [MessageResolver, MessageService, MessageRepository],
  exports: [MessageService, MessageRepository],
})
export class MessageModule {}
