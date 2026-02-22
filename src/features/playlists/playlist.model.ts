import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Video } from '../videos/video.model';
import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '../users/user.model';
import { BaseModel } from 'src/shared/database/base.model';

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
  @Property({ nullable: true, columnType: 'text' })
  description?: string;

  @Field((type) => [Video])
  @ManyToMany(() => Video, (video) => video.playlists, { owner: true })
  videos = new Collection<Video>(this);

  @ManyToOne(() => User, { deleteRule: 'cascade' })
  author!: User;

  @ManyToMany(() => User, (user) => user.savedPlaylists, { mappedBy: 'savedPlaylists' })
  savedBy = new Collection<User>(this);
}
