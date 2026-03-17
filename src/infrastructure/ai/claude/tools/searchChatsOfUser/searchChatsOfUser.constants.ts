import Anthropic from '@anthropic-ai/sdk';

export const searchChatsOfUserTool: Anthropic.Tool = {
  name: 'search_chats_of_user',
  description:
    'Searches the chat history of a user by keyword, matching against chat names using fulltext search. Use this tool when the user wants to find a previous conversation (e.g. "where did we talk about Docker?" or "find my chat about gaming").',
  input_schema: {
    type: 'object',
    properties: {
      userId: {
        type: 'integer',
        description: 'The ID of the user whose chats will be searched.',
      },
      keyword: {
        type: 'string',
        description:
          'The word or phrase to search for in chat names.',
      },
    },
    required: ['userId', 'keyword'],
    additionalProperties: false,
  },
};
