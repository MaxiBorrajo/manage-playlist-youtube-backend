import { Module } from '@nestjs/common';
import { ClaudeModule } from './claude/claude.module';
import { ToolsExecutionService } from './claude/toolsExecution.service';
import { VoyageAiModule } from './voyageAi/voyageAi.module';

@Module({
  imports: [VoyageAiModule, ClaudeModule],
})
export class AiModule {}
