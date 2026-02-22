import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './createUser.input';

@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(CreateUserInput, ['email']),
) {}
