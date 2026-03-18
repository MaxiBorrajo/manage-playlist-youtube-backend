import Anthropic from '@anthropic-ai/sdk';

export const addVideosToCurrentSelectionTool: Anthropic.Tool = {
  name: 'add_videos_to_current_selection',
  description:
    'Adds videos to the current selection (cart) of the chat. Use this tool when the user chooses videos from search results to save for later playlist creation. The videos must have been previously found via search_videos.',
  input_schema: {
    type: 'object',
    properties: {
      userId: {
        type: 'integer',
        description: 'The ID of the user.',
      },
      chatId: {
        type: 'integer',
        description: 'The ID of the chat session whose selection to add videos to.',
      },
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            videoId: {
              type: 'integer',
              description:
                'The database ID of the video to add to the selection. Must be an ID from a previously searched video.',
            },
          },
          required: ['videoId'],
          additionalProperties: false,
        },
        description:
          'The list of videos to add to the current selection.',
      },
    },
    required: ['userId', 'chatId', 'items'],
    additionalProperties: false,
  },
};
