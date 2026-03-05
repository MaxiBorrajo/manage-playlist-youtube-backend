import { Module } from '@nestjs/common';
import { ScrapersModule } from '../scrapers/scrapers.module';
import { ClaudeService } from './claude.service';
import { ToolsExecutionService } from './toolsExecution.service';

@Module({
    imports: [ScrapersModule],
  providers: [ClaudeService, ToolsExecutionService],
  exports: [ClaudeService],
})
export class AiModule {}
