import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlist.service';
import { PlaylistsResolver } from './playlist.resolver';
import { PlaylistRepository } from './playlist.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [PlaylistsService, PlaylistsResolver, PlaylistRepository],
  exports: [PlaylistsService],
})
export class PlaylistModule {}
