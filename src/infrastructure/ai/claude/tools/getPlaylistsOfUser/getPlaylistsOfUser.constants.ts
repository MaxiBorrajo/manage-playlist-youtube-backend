import Anthropic from '@anthropic-ai/sdk';

export const getPlaylistsOfUserTool: Anthropic.Tool = {
  name: 'get_playlists_of_user',
  description:
    'Retrieves all playlists owned by the user across all chat sessions. Use this tool when the user asks to see all their playlists, or when you need to find a specific playlist ID before performing operations like updating, adding/removing videos, or deleting a playlist.',
  input_schema: {
    type: 'object',
    properties: {
      userId: {
        type: 'integer',
        description: 'The ID of the user whose playlists will be retrieved.',
      },
    },
    required: ['userId'],
    additionalProperties: false,
  },
};
