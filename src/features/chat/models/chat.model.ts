import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseModel } from 'src/shared/database/base.model';
import { Message } from './message.model';
import { User } from 'src/features/users/user.model';

@ObjectType()
@Entity()
export class Chat extends BaseModel {
  @Field((type) => Int)
  @PrimaryKey({ type: 'integer', autoincrement: true })
  id: number;

  @Field()
  @Property()
  name: string;

  @Field((type) => [Message])
  @OneToMany(() => Message, (message) => message.chat)
  messages = new Collection<Message>(this);

    @Field((type) => User)
    @ManyToOne(() => User, { deleteRule: 'cascade' })
    user!: User;
}
