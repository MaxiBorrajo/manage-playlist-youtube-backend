import { Module } from "@nestjs/common";
import { ToolsExecutionService } from "./toolsExecution.service";
import { CreatePlaylistToolService } from "./createPlaylist/createPlaylist.service";
import { SearcherModule } from "./searcher/searcher.module";
import { PlaylistModule } from "src/features/playlist/playlist.module";

@Module({
  imports: [SearcherModule, PlaylistModule],
  providers: [ToolsExecutionService, CreatePlaylistToolService],
  exports: [ToolsExecutionService],
})
export class ToolsModule {}
