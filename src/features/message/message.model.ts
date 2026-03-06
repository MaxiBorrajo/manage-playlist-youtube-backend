import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseModel } from 'src/shared/database/base.model';
import { ChatRole } from '../chat/chat.types';
import { Chat } from '../chat/chat.model';

@ObjectType()
@Entity()
export class Message extends BaseModel {
  @Field((type) => Int)
  @PrimaryKey({ type: 'integer', autoincrement: true })
  id: number;

  @Field()
  @Property({ columnType: 'text' })
  content: string;

  @Field((type) => ChatRole)
  @Enum({ items: () => ChatRole, fieldName: 'role' })
  role: ChatRole;

  @Field((type) => Chat)
  @ManyToOne(() => Chat, { deleteRule: 'cascade' })
  chat!: Chat;
}
