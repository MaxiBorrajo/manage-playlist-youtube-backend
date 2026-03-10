import { Module } from '@nestjs/common';
import { SerperDevService } from './serper.dev/serperDev.service';
import { VideoModule } from 'src/features/video/video.module';

@Module({
  imports: [VideoModule],
  providers: [SerperDevService],
  exports: [SerperDevService],
})
export class ScrapersModule {}
