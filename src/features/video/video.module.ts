import { Module } from '@nestjs/common';
import { VideoRepository } from './video.repository';

@Module({
    providers: [VideoRepository],
    exports: [VideoRepository]
})
export class VideoModule {}
