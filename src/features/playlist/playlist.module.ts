import { forwardRef, Module } from '@nestjs/common';
import { PlaylistsService } from './playlist.service';
import { PlaylistsResolver } from './playlist.resolver';
import { PlaylistRepository } from './repositories/playlist.repository';
import { PlaylistItemRepository } from './repositories/playlistItem.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    PlaylistsService,
    PlaylistsResolver,
    PlaylistRepository,
    PlaylistItemRepository,
  ],
  exports: [PlaylistsService, PlaylistItemRepository, PlaylistRepository],
})
export class PlaylistModule {}
