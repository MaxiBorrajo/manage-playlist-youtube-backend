import Anthropic from '@anthropic-ai/sdk';

export const createPlaylistTool: Anthropic.Tool = {
  name: 'create_playlist',
  strict: true,
  description:
    'Creates a new playlist with the given name and videos. Use this tool when the user explicitly asks to create, save, or build a playlist from videos that were previously found via search. Do NOT use this tool unless the user clearly requests playlist creation.',
  input_schema: {
    type: 'object',
    properties: {
      userId: {
        type: 'integer',
        description:
          'The ID of the user for whom the playlist is being created. This should be a valid user ID from the database.',
      },
      name: {
        type: 'string',
        description:
          'A concise, descriptive name for the playlist that reflects its theme or content (e.g. "Docker Tutorials 2024", "Best Resident Evil Moments").',
      },
      thumbnail: {
        type: 'string',
        description:
          'URL of a thumbnail image for the playlist. Use the thumbnail of the most representative video in the playlist. Omit if no suitable thumbnail is available.',
      },
      description: {
        type: 'string',
        description:
          'A brief summary of what the playlist contains and why these videos were grouped together. Keep it to 1-2 sentences.',
      },
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            videoId: {
              type: 'integer',
              description:
                'The database ID of the video to add to the playlist. Must be an ID from a previously searched video.',
            },
            notes: {
              type: 'string',
              description:
                'Optional short note explaining why this video was included or what makes it relevant to the playlist.',
            },
            position: {
              type: 'integer',
              description:
                'The order position of this video in the playlist, starting at 1. Videos are displayed sorted by this value in ascending order.',
            },
          },
          required: ['videoId', 'position'],
          additionalProperties: false,
        },
        description:
          'The list of videos to include in the playlist, each with a position and optional notes.',
      },
    },
    required: ['name', 'items', 'userId'],
    additionalProperties: false,
  },
};
