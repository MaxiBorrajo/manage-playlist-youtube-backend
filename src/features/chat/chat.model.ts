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
import { User } from 'src/features/user/user.model';
import { Message } from '../message/message.model';
import { Video } from '../video/video.model';
import { Playlist } from '../playlist/models/playlist.model';

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

  @Field((type) => [Video])
  @OneToMany(() => Video, (video) => video.chat)
  currentSelection = new Collection<Video>(this);

  @Field((type) => [Playlist])
  @OneToMany(() => Playlist, (playlist) => playlist.chat)
  playlistsCreated = new Collection<Playlist>(this);

  @Field((type) => User)
  @ManyToOne(() => User, { deleteRule: 'cascade' })
  user!: User;
}
