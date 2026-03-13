import { Module } from '@nestjs/common';
import { ClaudeService } from './claude.service';
import { ToolsModule } from './tools/tools.module';

@Module({
  imports: [ToolsModule],
  providers: [ClaudeService],
  exports: [ClaudeService],
})
export class ClaudeModule {}
