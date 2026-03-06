import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { BaseRepository } from 'src/shared/database/base.repository';
import { Chat } from './chat.model';

@Injectable()
export class ChatRepository extends BaseRepository<Chat> {
  constructor(em: EntityManager) {
    super(em, Chat);
  }
}
