import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreatePlaylistInput } from './createPlaylist.input';

@InputType()
export class UpdatePlaylistInput extends PartialType(
  OmitType(CreatePlaylistInput, ['authorId', 'videoIds']),
) {}
