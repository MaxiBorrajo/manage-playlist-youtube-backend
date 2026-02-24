import { forwardRef, Module } from '@nestjs/common';
import { PlaylistsService } from './playlist.service';
import { PlaylistsResolver } from './playlist.resolver';
import { PlaylistRepository } from './playlist.repository';
import { UserModule } from '../users/user.module';
import { YoutubeModule } from 'src/infrastructure/youtube/youtube.module';

@Module({
  imports: [forwardRef(() => UserModule), YoutubeModule],
  controllers: [],
  providers: [PlaylistsService, PlaylistsResolver, PlaylistRepository],
  exports: [PlaylistsService],
})
export class PlaylistModule {}
