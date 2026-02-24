import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersResolver } from './user.resolver';
import { PlaylistModule } from '../playlists/playlist.module';
import { UserRepository } from './user.repository';
import { YoutubeModule } from 'src/infrastructure/youtube/youtube.module';

@Module({
  imports: [forwardRef(() => PlaylistModule), YoutubeModule],
  controllers: [],
  providers: [UsersService, UsersResolver, UserRepository],
  exports: [UsersService],
})
export class UserModule {}
