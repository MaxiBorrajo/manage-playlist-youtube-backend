import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/shared/database/base.model';
import { User } from '../user/user.model';

@ObjectType()
@Entity()
export class Tag extends BaseModel {
  @Field((type) => Int)
  @PrimaryKey({ type: 'integer', autoincrement: true })
  id: number;

  @Field()
  @Property()
  name: string;

  @Field((type) => User)
  @ManyToOne(() => User, { deleteRule: 'cascade' })
  author!: User;
}
