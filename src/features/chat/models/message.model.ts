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
import { Chat } from './chat.model';
import { ChatRole } from '../chat.types';

@ObjectType()
@Entity()
export class Message extends BaseModel {
  @Field((type) => Int)
  @PrimaryKey({ type: 'integer', autoincrement: true })
  id: number;

  @Field()
  @Property()
  content: string;

  @Field(type => ChatRole)
  @Enum({ items: () => ChatRole, fieldName: 'role' })
  role: ChatRole;

  @Field((type) => Chat)
  @ManyToOne(() => Chat, { deleteRule: 'cascade' })
  chat!: Chat;
}
