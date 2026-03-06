import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { BaseRepository } from 'src/shared/database/base.repository';
import { Message } from './message.model';


@Injectable()
export class MessageRepository extends BaseRepository<Message> {
  constructor(em: EntityManager) {
    super(em, Message);
  }
}
