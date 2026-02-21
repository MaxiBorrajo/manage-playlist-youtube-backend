import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async findOneById(id: number) {
    return await this.userRepository.findOneOrFail({ id });
  }
}
