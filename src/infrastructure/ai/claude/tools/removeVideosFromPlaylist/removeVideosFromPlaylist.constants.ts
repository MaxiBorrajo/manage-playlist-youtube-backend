import Anthropic from '@anthropic-ai/sdk';

export const removeVideosFromPlaylistTool: Anthropic.Tool = {
  name: 'remove_videos_from_playlist',
  description:
    'Removes a specific video from a playlist without deleting the playlist itself. Use this tool when the user wants to take a video out of an existing playlist. To delete the entire playlist, use remove_playlist instead.',
  input_schema: {
    type: 'object',
    properties: {
      userId: {
        type: 'integer',
        description: 'The ID of the user who owns the playlist.',
      },
      playlistId: {
        type: 'integer',
        description: 'The ID of the playlist from which to remove the video.',
      },
      videoId: {
        type: 'integer',
        description: 'The ID of the video to remove from the playlist.',
      },
    },
    required: ['videoId', 'userId', 'playlistId'],
    additionalProperties: false,
  },
};
