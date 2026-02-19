import { Module } from "@nestjs/common";
import { PlaylistsService } from "./playlist.service";

@Module({
  imports: [
  ],
  controllers: [],
  providers: [PlaylistsService],
  exports: [PlaylistsService],
})
export class PlaylistModule {}
