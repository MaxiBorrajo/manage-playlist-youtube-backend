import { Module } from '@nestjs/common';

@Module({
    imports: [],
  providers: [VoyageAiService],
  exports: [VoyageAiService],
})
export class VoyageAiModule {}
