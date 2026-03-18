import Anthropic from '@anthropic-ai/sdk';

export const addVideosToPlaylistTool: Anthropic.Tool = {
  name: 'add_videos_to_playlist',
  description:
    'Adds videos to an existing playlist. Use this tool when the user wants to add videos to a playlist that already exists. The videos must have been previously found via search_videos or be in the current selection.',
  input_schema: {
    type: 'object',
    properties: {
      userId: {
        type: 'integer',
        description: 'The ID of the user who owns the playlist.',
      },
      playlistId: {
        type: 'integer',
        description: 'The ID of the playlist to add the videos to.',
      },
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            videoId: {
              type: 'integer',
              description:
                'The database ID of the video to add to the playlist.',
            },
            notes: {
              type: 'string',
              description:
                'Optional short note explaining why this video was included or what makes it relevant to the playlist.',
            },
            position: {
              type: 'integer',
              description:
                'The order position of this video in the playlist, starting at 1.',
            },
          },
          required: ['videoId', 'position'],
          additionalProperties: false,
        },
        description:
          'The list of videos to add to the playlist, each with a position and optional notes.',
      },
    },
    required: ['userId', 'playlistId', 'items'],
    additionalProperties: false,
  },
};
