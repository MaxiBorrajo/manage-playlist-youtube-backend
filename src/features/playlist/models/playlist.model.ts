import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Video } from '../../video/video.model';
import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Opt,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '../../user/user.model';
import { BaseModel } from 'src/shared/database/base.model';
import { PlaylistItem } from './playlistItem.model';
import { Chat } from 'src/features/chat/chat.model';

@ObjectType()
@Entity()
export class Playlist extends BaseModel {
  @Field((type) => Int)
  @PrimaryKey({ type: 'integer', autoincrement: true })
  id: number;

  @Field()
  @Property()
  name: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  thumbnail?: string;

  @Field({ nullable: true })
  @Property({ nullable: true, columnType: 'text' })
  description?: string;

  @Field((type) => [PlaylistItem])
  @OneToMany(() => PlaylistItem, (item) => item.playlist)
  items = new Collection<PlaylistItem>(this);

  @Field((type) => User)
  @ManyToOne(() => User, { deleteRule: 'cascade' })
  author!: User;

    @Field((type) => Chat)
  @ManyToOne(() => Chat, { deleteRule: 'cascade' })
  chat!: Chat;

  
}
