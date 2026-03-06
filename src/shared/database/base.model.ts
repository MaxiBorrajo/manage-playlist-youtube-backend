import { Entity, Opt, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity({ abstract: true })
export abstract class BaseModel {

    @Field(() => Date)
  @Property({
    type: 'datetime',
    columnType: 'timestamp(6)',
    defaultRaw: `now()`,
    fieldName: 'created_at',
  })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  @Property({
    columnType: 'timestamp(6)',
    nullable: true,
    fieldName: 'updated_at',
    onUpdate: () => new Date(),
  })
  updatedAt?: Date;
}
