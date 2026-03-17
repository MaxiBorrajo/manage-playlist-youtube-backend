import Anthropic from '@anthropic-ai/sdk';

export const getVideosOfPlaylistTool: Anthropic.Tool = {
  name: 'get_videos_of_playlist',
  description:
    'Retrieves all videos in a specific playlist, including their positions and notes. Use this tool when the user wants to see the contents of a playlist, or when you need to know the video IDs within a playlist before performing operations like removing or reordering videos.',
  input_schema: {
    type: 'object',
    properties: {
      userId: {
        type: 'integer',
        description: 'The ID of the user who owns the playlist.',
      },
      playlistId: {
        type: 'integer',
        description: 'The ID of the playlist whose videos will be retrieved.',
      },
    },
    required: ['userId', 'playlistId'],
    additionalProperties: false,
  },
};
