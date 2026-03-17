import Anthropic from '@anthropic-ai/sdk';

export const searchMessagesOfChatTool: Anthropic.Tool = {
  name: 'search_messages_of_chat',
  description:
    'Searches for messages within a specific chat session using fulltext search. Use this tool when the user wants to find something that was said in a conversation, such as a video recommendation, a playlist discussion, or any previous message.',
  input_schema: {
    type: 'object',
    properties: {
      chatId: {
        type: 'integer',
        description:
          'The ID of the chat to search in. Can be the current chat or another chat if needed.',
      },
      userId: {
        type: 'integer',
        description:
          'The ID of the user who owns the chat.',
      },
      keyword: {
        type: 'string',
        description:
          'The word or phrase to search for within the messages of the chat.',
      },
    },
    required: ['chatId', 'userId', 'keyword'],
    additionalProperties: false,
  },
};
