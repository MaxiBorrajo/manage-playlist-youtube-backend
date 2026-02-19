import { Module } from '@nestjs/common';
import { User } from './user.model';
import { UsersService } from './user.service';
import { UsersResolver } from './user.resolver';
import { PlaylistModule } from '../playlists/playlist.module';

@Module({
  imports: [PlaylistModule],
  controllers: [],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UserModule {}
