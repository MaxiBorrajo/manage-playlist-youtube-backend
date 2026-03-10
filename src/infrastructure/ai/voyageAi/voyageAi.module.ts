import { Module } from '@nestjs/common';
import { VoyageAiService } from './voyageAi.service';

@Module({
    imports: [],
  providers: [VoyageAiService],
  exports: [VoyageAiService],
})
export class VoyageAiModule {}
