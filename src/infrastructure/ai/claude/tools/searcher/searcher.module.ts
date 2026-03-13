import { Module } from '@nestjs/common';
import { SearcherService } from './searcher.service';
import { ScrapersModule } from './scrapers/scrapers.module';
import { VideoModule } from 'src/features/video/video.module';
import { VoyageAiModule } from 'src/infrastructure/ai/voyageAi/voyageAi.module';

@Module({
  imports: [VoyageAiModule, VideoModule, ScrapersModule],
  providers: [SearcherService],
  exports: [SearcherService],
})
export class SearcherModule {}
