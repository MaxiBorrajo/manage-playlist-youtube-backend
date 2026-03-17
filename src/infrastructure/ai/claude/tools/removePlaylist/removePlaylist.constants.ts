import Anthropic from '@anthropic-ai/sdk';

export const removePlaylistTool: Anthropic.Tool = {
  name: 'remove_playlist',
  description:
    'Permanently deletes a playlist and all its items. This action is irreversible. Use this tool only when the user explicitly asks to delete or remove an entire playlist. Always confirm with the user before calling this tool.',
  input_schema: {
    type: 'object',
    properties: {
      userId: {
        type: 'integer',
        description: 'The ID of the user who owns the playlist.',
      },
      playlistId: {
        type: 'integer',
        description: 'The ID of the playlist to permanently delete.',
      },
    },
    required: ['userId', 'playlistId'],
    additionalProperties: false,
  },
};
