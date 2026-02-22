import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Playlist } from '../playlists/playlist.model';
import { BaseModel } from 'src/shared/database/base.model';

@ObjectType()
@Entity()
export class Video extends BaseModel {
  @Field((type) => Int)
  @PrimaryKey({ type: 'integer', autoincrement: true })
  id: number;

  @Field()
  @Property()
  name: string;

  @Field({nullable: true})
  @Property({ nullable: true, columnType: 'text' })
  description?: string;

  @Field()
  @Property()
  url: string;

  @ManyToMany(() => Playlist, (playlist) => playlist.videos, { mappedBy: 'videos' })
  playlists = new Collection<Playlist>(this);
}
