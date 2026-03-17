import Anthropic from '@anthropic-ai/sdk';

export const getCurrentAssociatedVideosWithChatTool: Anthropic.Tool = {
  name: 'get_current_associated_videos_with_chat',
  description:
    'Retrieves the current selection of videos in a chat session. These are videos that were found via search and are temporarily associated with the chat as a "cart" before being organized into a playlist. Use this tool to check what videos are available before creating a playlist, or when the user asks to see the videos found so far in the current conversation.',
  input_schema: {
    type: 'object',
    properties: {
      userId: {
        type: 'integer',
        description: 'The ID of the user who owns the chat.',
      },
      chatId: {
        type: 'integer',
        description: 'The ID of the chat whose current video selection will be retrieved.',
      },
    },
    required: ['userId', 'chatId'],
    additionalProperties: false,
  },
};
