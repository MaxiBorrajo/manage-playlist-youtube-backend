import { forwardRef, Module } from '@nestjs/common';
import { ToolsExecutionService } from './toolsExecution.service';
import { CreatePlaylistToolService } from './createPlaylist/createPlaylist.service';
import { SearcherModule } from './searcher/searcher.module';
import { PlaylistModule } from 'src/features/playlist/playlist.module';
import { ChatModule } from 'src/features/chat/chat.module';
import { VideoModule } from 'src/features/video/video.module';
import { UpdatePlaylistItemsToolService } from './updatePlaylistItems/updatePlaylistItems.service';
import { UpdatePlaylistToolService } from './updatePlaylist/updatePlaylist.service';
import { SearchMessagesOfChatToolService } from './searchMessagesOfChat/searchMessagesOfChat.service';
import { SearchChatsOfUserToolService } from './searchChatsOfUser/searchChatsOfUser.service';
import { RemoveVideosFromPlaylistToolService } from './removeVideosFromPlaylist/removeVideosFromPlaylist.service';
import { RemovePlaylistToolService } from './removePlaylist/removePlaylist.service';
import { RemoveAssociatedVideosWithChatToolService } from './removeAssociatedVideosWithChat/removeAssociatedVideosWithChat.service';
import { GetVideosOfPlaylistToolService } from './getVideosOfPlaylist/getVideosOfPlaylist.service';
import { GetPlaylistsOfUserToolService } from './getPlaylistsOfUser/getPlaylistsOfUser.service';
import { GetPlaylistsAssociatedWithChatToolService } from './getPlaylistsAssociatedWithChat/getPlaylistsAssociatedWithChat.service';
import { GetCurrentAssociatedVideosWithChatToolService } from './getCurrentAssociatedVideosWithChat/getCurrentAssociatedVideosWithChat.service';
import { AddVideosToPlaylistToolService } from './addVideosToPlaylist/addVideosToPlaylist.service';
import { MessageModule } from 'src/features/message/message.module';

@Module({
  imports: [SearcherModule, PlaylistModule, forwardRef(() => ChatModule), VideoModule, forwardRef(() => MessageModule)],
  providers: [
    ToolsExecutionService,
    CreatePlaylistToolService,
    UpdatePlaylistItemsToolService,
    UpdatePlaylistToolService,
    SearchMessagesOfChatToolService,
    SearchChatsOfUserToolService,
    RemoveVideosFromPlaylistToolService,
    RemovePlaylistToolService,
    RemoveAssociatedVideosWithChatToolService,
    GetVideosOfPlaylistToolService,
    GetPlaylistsOfUserToolService,
    GetPlaylistsAssociatedWithChatToolService,
    GetCurrentAssociatedVideosWithChatToolService,
    AddVideosToPlaylistToolService
  ],
  exports: [ToolsExecutionService],
})
export class ToolsModule {}
