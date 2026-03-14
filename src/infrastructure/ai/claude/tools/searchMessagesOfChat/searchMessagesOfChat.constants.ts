import Anthropic from '@anthropic-ai/sdk';

export const searchMessagesOfChatTool: Anthropic.Tool = {
  name: 'search_messages_of_chat',
  strict: true,
  description:
    'Searches for messages within a specific chat session. Use this tool when the user explicitly asks to find messages in a particular chat.',
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
          'The ID of the current user. Only their own chats can be searched.',
      },
      keyword: {
        type: 'string',
        description:
          'The keyword to search for among the messages of the specified chat.',
      },
      metadata: {
        type: 'object',
        description:
          'Optional filter to search messages that contain specific metadata such as videos or playlists.',
        properties: {
          videos: {
            type: 'array',
            description:
              'Filter messages that contain these videos in their metadata.',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'The database ID of the video.',
                },
                link: {
                  type: 'string',
                  description: 'The URL of the video.',
                },
                title: {
                  type: 'string',
                  description: 'The title of the video.',
                },
                description: {
                  type: 'string',
                  description: 'The description of the video.',
                },
                imageUrl: {
                  type: 'string',
                  description: 'The thumbnail URL of the video.',
                },
                channel: {
                  type: 'string',
                  description: 'The channel name that published the video.',
                },
                date: {
                  type: 'string',
                  description: 'The publish date of the video.',
                },
                duration: {
                  type: 'string',
                  description: 'The duration of the video.',
                },
                reason: {
                  type: 'string',
                  description:
                    'The reason why this video was included or recommended.',
                },
              },
              required: ['id', 'link', 'title', 'channel'],
              additionalProperties: false,
            },
          },
          playlist: {
            type: 'object',
            description:
              'Filter messages that contain this playlist in their metadata.',
            properties: {
              id: {
                type: 'integer',
                description: 'The database ID of the playlist.',
              },
              name: {
                type: 'string',
                description: 'The name of the playlist.',
              },
              thumbnail: {
                type: 'string',
                description: 'The thumbnail URL of the playlist.',
              },
              description: {
                type: 'string',
                description: 'The description of the playlist.',
              },
            },
            required: ['id', 'name'],
            additionalProperties: false,
          },
        },
        required: [],
        additionalProperties: false,
      },
    },
    required: ['chatId', 'userId', 'keyword'],
    additionalProperties: false,
  },
};
