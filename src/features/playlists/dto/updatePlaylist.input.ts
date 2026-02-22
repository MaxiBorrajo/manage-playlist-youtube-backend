import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreatePlaylistInput } from './createPlaylist.input';
import { IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class UpdatePlaylistInput extends PartialType(
  OmitType(CreatePlaylistInput, [ 'videoIds']),
) {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
