import { Module } from '@nestjs/common';
import { SearcherService } from './searcher.service';
import { ScrapersModule } from './scrapers/scrapers.module';
import { VoyageAiModule } from '../ai/voyageAi/voyageAi.module';
import { VideoModule } from 'src/features/video/video.module';

@Module({
  imports: [VoyageAiModule, VideoModule, ScrapersModule],
  providers: [SearcherService],
  exports: [SearcherService],
})
export class SearcherModule {}
