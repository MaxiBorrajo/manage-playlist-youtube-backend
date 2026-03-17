import Anthropic from '@anthropic-ai/sdk';

export const updatePlaylistItemTool: Anthropic.Tool = {
  name: 'update_playlist_items',
  description:
    'Updates the notes and/or position of videos already in a playlist. This does NOT add or remove videos — use add_videos_to_playlist or remove_videos_from_playlist for that. Use this tool when the user wants to reorder videos within a playlist or update the notes associated with specific videos.',
  input_schema: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            playlistId: {
              type: 'integer',
              description:
                'The database ID of the playlist. Required to identify the playlist item to update.',
            },
            videoId: {
              type: 'integer',
              description:
                'The database ID of the video. Required to identify the playlist item to update.',
            },
            notes: {
              type: 'string',
              description:
                'Updated short note explaining why this video was included or what makes it relevant to the playlist.',
            },
            position: {
              type: 'integer',
              description:
                'Updated order position of this video in the playlist, starting at 1. Videos are displayed sorted by this value in ascending order.',
            },
          },
          required: ['videoId', 'playlistId'],
          additionalProperties: false,
        },
        description:
          'The list of playlist items to update. Each item requires playlistId and videoId to identify the item, and can update its notes and/or position.',
      },
    },
    required: ['items'],
    additionalProperties: false,
  },
};
