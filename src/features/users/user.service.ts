import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { UserRepository } from './user.repository';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';

@Injectable()
export class UsersService {
  async update(id: number, updateUserInput: UpdateUserInput) {
    const user = await this.findOneById(id);
    this.userRepository.assign(user, updateUserInput, { ignoreUndefined: true });
    await this.userRepository.save(user);
    return user;
  }
  
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async create(createUserInput: CreateUserInput) {
    const user = this.userRepository.create(createUserInput);
    await this.userRepository.save(user);
    return user;
  }

  async findOneById(id: number) {
    return await this.userRepository.findOneOrFail({ id });
  }
}
