import Anthropic from '@anthropic-ai/sdk';

export const updatePlaylistTool: Anthropic.Tool = {
  name: 'update_playlist',
  strict: true,
  description:
    'Updates an existing playlist with the given name and videos. Use this tool when the user explicitly asks to update a playlist. Do NOT use this tool unless the user clearly requests playlist updates.',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description:
          'The database ID of the playlist. Required to identify the playlist to update.',
      },
      userId: {
        type: 'integer',
        description:
          'The ID of the user who owns the playlist. Required to identify the playlist to update.',
      },
      name: {
        type: 'string',
        description:
          'Updated name for the playlist. A concise, descriptive name that reflects its theme or content (e.g. "Docker Tutorials 2024", "Best Resident Evil Moments").',
      },
      thumbnail: {
        type: 'string',
        description:
          'Updated thumbnail URL for the playlist. Use the thumbnail of the most representative video in the playlist.',
      },
      description: {
        type: 'string',
        description:
          'Updated summary of what the playlist contains and why these videos were grouped together. Keep it to 1-2 sentences.',
      },
    },
    required: ['id', 'userId'],
    additionalProperties: false,
  },
};
