import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
} from 'class-validator';

@InputType()
export class CreatePlaylistInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => [Number], { nullable: true })
  @IsInt({ each: true })
  @IsOptional()
  videoIds?: number[];

  @Field()
  @IsInt()
  @IsNotEmpty()
  authorId: number;
}
