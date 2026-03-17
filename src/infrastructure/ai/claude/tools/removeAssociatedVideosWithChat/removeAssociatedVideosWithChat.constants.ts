import Anthropic from '@anthropic-ai/sdk';

export const removeAssociatedVideosWithChatTool: Anthropic.Tool = {
  name: 'remove_associated_videos_with_chat',
  description:
    'Removes a video from the current selection (cart) of a chat session. This does NOT remove the video from any playlist — it only removes it from the temporary working set of videos in the chat. Use this tool when the user says they do not want a specific video that was found via search, before creating a playlist.',
  input_schema: {
    type: 'object',
    properties: {
      userId: {
        type: 'integer',
        description: 'The ID of the user who owns the chat.',
      },
      chatId: {
        type: 'integer',
        description: 'The ID of the chat from which to remove the video from the current selection.',
      },
      videoId: {
        type: 'integer',
        description: 'The ID of the video to remove from the current selection.',
      },
    },
    required: ['userId', 'chatId', 'videoId'],
    additionalProperties: false,
  },
};
