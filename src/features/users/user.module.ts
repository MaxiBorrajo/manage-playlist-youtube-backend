import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersResolver } from './user.resolver';
import { PlaylistModule } from '../playlists/playlist.module';
import { UserRepository } from './user.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [UsersService, UsersResolver, UserRepository],
  exports: [UsersService],
})
export class UserModule {}
