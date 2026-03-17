import Anthropic from '@anthropic-ai/sdk';

export const addVideosToPlaylistTool: Anthropic.Tool = {
  name: 'add_videos_to_playlist',
  description:
    'Adds a video to an existing playlist at a specified position. Use this tool when the user wants to add a video (from search results or from the current selection) to a playlist that already exists. The video must have been previously found via search_videos.',
  input_schema: {
    type: 'object',
    properties: {
      userId: {
        type: 'integer',
        description: 'The ID of the user who owns the playlist.',
      },
      playlistId: {
        type: 'integer',
        description: 'The ID of the playlist to which to add the video.',
      },
      videoId: {
        type: 'integer',
        description: 'The ID of the video to add to the playlist.',
      },
      position: {
        type: 'integer',
        description:
          'The position at which to add the video in the playlist. If not provided, the video will be added at the end of the playlist.',
      },
    },
    required: ['videoId', 'userId', 'playlistId', 'position'],
    additionalProperties: false,
  },
};
