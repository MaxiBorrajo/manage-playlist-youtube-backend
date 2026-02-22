import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/user.service';
import { ILogin } from './auth.types';

@Injectable()
export class AuthService {
  
  constructor(private readonly usersService: UsersService) {}

  async handleLogin(user: ILogin) {
    const userFound = await this.usersService.findOneByEmailAndGoogleId(user.googleId, user.email);

    if (userFound) {
      await this.usersService.update(userFound.id, user);
      return userFound;
    }

    return this.usersService.create(user);
  }
}
