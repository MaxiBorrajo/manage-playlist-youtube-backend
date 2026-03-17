import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Collection,
  Entity,
  Enum,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseModel } from 'src/shared/database/base.model';
import { ChatRole } from '../chat/chat.types';
import { Chat } from '../chat/chat.model';
import GraphQLJSON from 'graphql-type-json';
import { FullTextType } from '@mikro-orm/postgresql';

@ObjectType()
@Entity()
export class Message extends BaseModel {
  @Field((type) => Int)
  @PrimaryKey({ type: 'integer', autoincrement: true })
  id: number;

  @Field()
  @Index()
  @Property({ columnType: 'text' })
  content: string;

  @Field()
  @Property({
    type: FullTextType,
    onUpdate: (message: Message) => message.content,
    nullable: true,
  })
  @Index({ type: 'fulltext' })
  searchableContent?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @Property({ columnType: 'json', nullable: true })
  metadata?: JSON;

  @Field((type) => ChatRole)
  @Enum({ items: () => ChatRole, fieldName: 'role' })
  role: ChatRole;

  @Field((type) => Chat)
  @ManyToOne(() => Chat, { deleteRule: 'cascade' })
  chat!: Chat;
}
