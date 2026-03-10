import { Module } from '@nestjs/common';
import { SerperDevService } from './serper.dev/serperDev.service';
import { VideoModule } from 'src/features/video/video.module';
import { VoyageAiModule } from 'src/infrastructure/ai/voyageAi/voyageAi.module';

@Module({
  imports: [VideoModule, VoyageAiModule],
  providers: [SerperDevService],
  exports: [SerperDevService],
})
export class ScrapersModule {}
