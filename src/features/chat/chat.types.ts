import { registerEnumType } from "@nestjs/graphql";

export enum ChatRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

registerEnumType(ChatRole, {
  name: 'ChatRole',
});