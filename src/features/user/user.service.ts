import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { Transactional } from '@mikro-orm/core';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async findOneByEmail(
    email: string | undefined,
  ) {
    return await this.userRepository.findOne({ email });
  }

  async update(id: number, updateUser: Partial<User>) {
    const user = await this.findOneById(id);
    this.userRepository.assign(user, updateUser, {
      ignoreUndefined: true,
    });
    await this.userRepository.save(user);
    return user;
  }

  @Transactional()
  async create(user: CreateUserDto) {
    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async findOneById(id: number) {
    return await this.userRepository.findOneOrFail({ id });
  }
}
