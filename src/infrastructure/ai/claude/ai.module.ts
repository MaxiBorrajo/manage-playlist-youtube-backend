import { Module } from '@nestjs/common';

@Module({
    imports: [SearcherModule],
  providers: [ClaudeService, ToolsExecutionService],
  exports: [ClaudeService],
})
export class ClaudeModule {}
