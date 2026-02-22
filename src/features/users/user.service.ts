import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { UserRepository } from './user.repository';
import { UpdateUserInput } from './dto/updateUser.input';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  
  
  constructor(private readonly userRepository: UserRepository) {}

  async findOneByEmailAndGoogleId(googleId: string | undefined, email: string | undefined) {
    return await this.userRepository.findOne({ googleId, email });
  }

  async update(id: number, updateUser: Partial<User>) {
    const user = await this.findOneById(id);
    this.userRepository.assign(user, updateUser, {
      ignoreUndefined: true,
    });
    await this.userRepository.save(user);
    return user;
  }


  async create(user: CreateUserDto) {
    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async findOneById(id: number) {
    return await this.userRepository.findOneOrFail({ id });
  }
}
