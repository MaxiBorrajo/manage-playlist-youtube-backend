import { Entity, Opt, Property } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity({ abstract: true })
export abstract class BaseModel {
  @Property({
    type: 'datetime',
    columnType: 'timestamp(6)',
    defaultRaw: `now()`,
    fieldName: 'created_at',
  })
  createdAt?: Date;

  @Property({
    columnType: 'timestamp(6)',
    nullable: true,
    fieldName: 'updated_at',
    onUpdate: () => new Date(),
  })
  updatedAt?: Date;
}
