import {
  Collection,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Playlist } from '../playlist/models/playlist.model';
import { BaseModel } from 'src/shared/database/base.model';
import { PlaylistItem } from '../playlist/models/playlistItem.model';

@ObjectType()
@Entity()
export class Video extends BaseModel {
  @Field((type) => Int)
  @PrimaryKey({ type: 'integer', autoincrement: true })
  id: number;

  @Field()
  @Property()
  title: string;

  @Field({ nullable: true })
  @Property({ nullable: true, columnType: 'text' })
  description?: string;

  @Field()
  @Property()
  url: string;

  @Field({ nullable: true })
  @Property({ unique: true, nullable: true })
  videoId?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  thumbnail?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  duration?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  source?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  channel?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  @Index()
  publishedAt?: string;

  @Field()
  @Property()
  @Index()
  language: string;

  @Field()
  @Property()
  @Index()
  country: string;

  @Property({
    type: 'vector',
    length: 768,
  })
  embedding: unknown;

  @Property({ persist: false })
  distance?: number;

  @Field((type) => [PlaylistItem])
  @OneToMany(() => PlaylistItem, (item) => item.video)
  items = new Collection<PlaylistItem>(this);
}
