import Anthropic from '@anthropic-ai/sdk';
import { ToolResultBlockParam } from '@anthropic-ai/sdk/resources';
import { Injectable } from '@nestjs/common';
import { Tool } from './tools.types';
import { CreatePlaylistToolService } from './createPlaylist/createPlaylist.service';
import { SearcherService } from './searcher/searcher.service';
import { UpdatePlaylistItemsToolService } from './updatePlaylistItems/updatePlaylistItems.service';
import { SearchMessagesOfChatToolService } from './searchMessagesOfChat/searchMessagesOfChat.service';
import { UpdatePlaylistToolService } from './updatePlaylist/updatePlaylist.service';
import { SearchChatsOfUserToolService } from './searchChatsOfUser/searchChatsOfUser.service';
import { RemoveVideosFromPlaylistToolService } from './removeVideosFromPlaylist/removeVideosFromPlaylist.service';
import { RemovePlaylistToolService } from './removePlaylist/removePlaylist.service';
import { GetVideosOfPlaylistToolService } from './getVideosOfPlaylist/getVideosOfPlaylist.service';
import { GetPlaylistsOfUserToolService } from './getPlaylistsOfUser/getPlaylistsOfUser.service';
import { GetPlaylistsAssociatedWithChatToolService } from './getPlaylistsAssociatedWithChat/getPlaylistsAssociatedWithChat.service';
import { GetCurrentAssociatedVideosWithChatToolService } from './getCurrentAssociatedVideosWithChat/getCurrentAssociatedVideosWithChat.service';
import { AddVideosToPlaylistToolService } from './addVideosToPlaylist/addVideosToPlaylist.service';
import { RemoveAssociatedVideosWithChatToolService } from './removeAssociatedVideosWithChat/removeAssociatedVideosWithChat.service';

@Injectable()
export class ToolsExecutionService {
  tools: Tool[] = [];
  constructor(
    private readonly searcherService: SearcherService,
    private readonly createPlaylistToolService: CreatePlaylistToolService,
    private readonly updatePlaylistItemsToolService: UpdatePlaylistItemsToolService,
    private readonly updatePlaylistToolService: UpdatePlaylistToolService,
    private readonly searchMessagesOfChatToolService: SearchMessagesOfChatToolService,
    private readonly searchChatsOfUserToolService: SearchChatsOfUserToolService,
    private readonly removeVideosFromPlaylistToolService: RemoveVideosFromPlaylistToolService,
    private readonly removePlaylistToolService: RemovePlaylistToolService,
    private readonly getVideosOfPlaylistToolService: GetVideosOfPlaylistToolService,
    private readonly getPlaylistsOfUserToolService: GetPlaylistsOfUserToolService,
    private readonly getPlaylistsAssociatedWithChatToolService: GetPlaylistsAssociatedWithChatToolService,
    private readonly getCurrentAssociatedVideosWithChatToolService: GetCurrentAssociatedVideosWithChatToolService,
    private readonly addVideosToPlaylistToolService: AddVideosToPlaylistToolService,
    private readonly removeAssociatedVideosWithChatToolService: RemoveAssociatedVideosWithChatToolService
  ) {
    this.tools.push(this.searcherService);
    this.tools.push(this.createPlaylistToolService);
    this.tools.push(this.updatePlaylistItemsToolService);
    this.tools.push(this.updatePlaylistToolService);
    this.tools.push(this.searchMessagesOfChatToolService);
    this.tools.push(this.searchChatsOfUserToolService);
    this.tools.push(this.removeVideosFromPlaylistToolService);
    this.tools.push(this.removePlaylistToolService);
    this.tools.push(this.getVideosOfPlaylistToolService);
    this.tools.push(this.getPlaylistsOfUserToolService);
    this.tools.push(this.getPlaylistsAssociatedWithChatToolService);
    this.tools.push(this.getCurrentAssociatedVideosWithChatToolService);
    this.tools.push(this.addVideosToPlaylistToolService);
    this.tools.push(this.removeAssociatedVideosWithChatToolService);
  }

  async execute(
    content: Anthropic.Messages.ContentBlock[],
  ): Promise<ToolResultBlockParam[]> {
    const toolBlocks = content.filter((block) => block.type === 'tool_use');

    const toolResultsPromises = await Promise.all(
      this.tools.map(async (tool) => tool.execute(toolBlocks)),
    );

    return toolResultsPromises.flatMap((result) => result.flat());
  }
}
