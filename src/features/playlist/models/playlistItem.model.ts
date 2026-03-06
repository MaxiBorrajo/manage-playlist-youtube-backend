import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/shared/database/base.model';
import { Playlist } from './playlist.model';
import { Video } from 'src/features/video/video.model';

@ObjectType()
@Entity()
export class PlaylistItem extends BaseModel {
  @Field((type) => Playlist)
  @ManyToOne(() => Playlist, { deleteRule: 'cascade', primary: true })
  playlist!: Playlist;

  @Field((type) => Video)
  @ManyToOne(() => Video, { deleteRule: 'cascade', primary: true })
  video!: Video;

  @Field((type) => Int)
  @Property({ type: 'integer' })
  position: number;

  @Field()
  @Property({ nullable: true, columnType: 'text' })
  notes?: string;
}
