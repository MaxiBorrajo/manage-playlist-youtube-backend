import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Playlist } from '../playlists/playlist.model';

@ObjectType()
export class User {
  @Field((type) => Int)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field((type) => [Playlist])
  playlists: Playlist[];
}
