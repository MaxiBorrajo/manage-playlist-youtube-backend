import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Playlist } from '../playlists/playlist.model';
import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseModel } from 'src/shared/database/base.model';
import { Chat } from '../chat/models/chat.model';

@ObjectType()
@Entity()
export class User extends BaseModel {
  @Field((type) => Int)
  @PrimaryKey({ type: 'integer', autoincrement: true })
  id: number;

  @Field()
  @Property()
  username: string;

  @Field()
  @Property({ unique: true })
  email: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  picture?: string;

  @Field((type) => [Playlist])
  @OneToMany(() => Playlist, (playlist) => playlist.author)
  createdPlaylists = new Collection<Playlist>(this);

  @Field((type) => [Chat])
  @OneToMany(() => Chat, (chat) => chat.user)
  createdChats = new Collection<Chat>(this);
}
