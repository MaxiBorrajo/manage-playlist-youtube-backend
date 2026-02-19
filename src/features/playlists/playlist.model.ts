import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Video } from '../videos/video.model';

@ObjectType()
export class Playlist {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field((type) => [Video])
  videos: Video[];
}
