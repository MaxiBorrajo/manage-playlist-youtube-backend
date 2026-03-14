import Anthropic from '@anthropic-ai/sdk';
import { ToolResultBlockParam } from '@anthropic-ai/sdk/resources';
import { Injectable } from '@nestjs/common';
import { Tool } from './tools.types';
import { CreatePlaylistToolService } from './createPlaylist/createPlaylist.service';
import { SearcherService } from './searcher/searcher.service';
import { UpdatePlaylistItemsToolService } from './updatePlaylistItems/updatePlaylistItems.service';
import { SearchMessagesOfChatToolService } from './searchMessagesOfChat/searchMessagesOfChat.service';
import { UpdatePlaylistToolService } from './updatePlaylist/updatePlaylist.service';

@Injectable()
export class ToolsExecutionService {
  tools: Tool[] = [];
  constructor(
    private readonly searcherService: SearcherService,
    private readonly createPlaylistToolService: CreatePlaylistToolService,
    private readonly updatePlaylistItemsToolService: UpdatePlaylistItemsToolService,
    private readonly updatePlaylistToolService: UpdatePlaylistToolService,
    private readonly searchMessagesOfChatToolService: SearchMessagesOfChatToolService,
  ) {
    this.tools.push(this.searcherService);
    this.tools.push(this.createPlaylistToolService);
    this.tools.push(this.updatePlaylistItemsToolService);
    this.tools.push(this.updatePlaylistToolService);
    this.tools.push(this.searchMessagesOfChatToolService);
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
