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
  @Property()
  email: string;

  @Field((type) => [Playlist])
  @OneToMany(() => Playlist, (playlist) => playlist.author)
  createdPlaylists = new Collection<Playlist>(this);

  @Field((type) => [Playlist])
  @ManyToMany(() => Playlist, (playlist) => playlist.savedBy, { owner: true })
  savedPlaylists = new Collection<Playlist>(this);
}
