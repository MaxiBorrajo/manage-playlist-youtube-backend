import { Module } from '@nestjs/common';
import { SearcherService } from './searcher.service';

@Module({
  imports: [ScrapersModule],
  providers: [SearcherService],
  exports: [SearcherService],
})
export class SearcherModule {}
