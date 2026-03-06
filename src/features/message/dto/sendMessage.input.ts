import { Field, InputType } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class SendMessageInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @Field({nullable: true})
  @IsInt()
  @IsOptional()
  chatId?: number;
}
