import Anthropic from '@anthropic-ai/sdk';

export const getPlaylistsAssociatedWithChatTool: Anthropic.Tool = {
  name: 'get_playlists_associated_with_chat',
  description:
    'Retrieves the playlists that were created during a specific chat session. Use this tool when the user wants to see what playlists were created in the current conversation. Unlike get_playlists_of_user which returns ALL playlists, this only returns playlists created within this particular chat.',
  input_schema: {
    type: 'object',
    properties: {
      userId: {
        type: 'integer',
        description: 'The ID of the user who owns the chat.',
      },
      chatId: {
        type: 'integer',
        description: 'The ID of the chat whose created playlists will be retrieved.',
      },
    },
    required: ['userId', 'chatId'],
    additionalProperties: false,
  },
};
