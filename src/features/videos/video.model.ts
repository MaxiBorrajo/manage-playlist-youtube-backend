import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Video {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  url: string;
}
