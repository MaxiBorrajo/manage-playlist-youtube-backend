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

  @Field()
  @Property({ unique: true })
  videoId: string;

  @Field()
  @Property()
  thumbnail: string;

  @Field()
  @Property()
  duration: string;

  @Field()
  @Property()
  source: string;

  @Field()
  @Property()
  channel: string;

  @Field()
  @Property()
  @Index()
  publishedAt: string;

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
    length: 1536,
  })
  embedding: unknown;

  @Property({ persist: false })
  distance?: number;

  @Field((type) => [PlaylistItem])
  @OneToMany(() => PlaylistItem, (item) => item.video)
  items = new Collection<PlaylistItem>(this);
}
