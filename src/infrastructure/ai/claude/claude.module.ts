import { Module } from '@nestjs/common';
import { SearcherModule } from 'src/infrastructure/searcher/searcher.module';
import { ClaudeService } from './claude.service';
import { ToolsExecutionService } from './toolsExecution.service';

@Module({
    imports: [SearcherModule],
  providers: [ClaudeService, ToolsExecutionService],
  exports: [ClaudeService],
})
export class ClaudeModule {}
