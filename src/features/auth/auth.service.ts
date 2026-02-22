import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/user.service';
import { ILogin, JwtUser, UserLoginResponse } from './auth.types';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.model';
import { Loaded } from '@mikro-orm/core';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(userId: string): Promise<JwtUser> {
    const user = await this.usersService.findOneById(Number(userId));

    return {
      id: user.id,
      accessToken: user.googleAccessToken,
      refreshToken: user.googleRefreshToken,
      googleId: user.googleId,
    };
  }

  async handleLogin(
    user: ILogin,
  ): Promise<{ accessToken: string; user: UserLoginResponse }> {
    const userFound = await this.usersService.findOneByEmailAndGoogleId(
      user.googleId,
      user.email,
    );

    if (userFound) {
      await this.usersService.update(userFound.id, user);
      return {
        accessToken: await this.generateJwt(userFound.id),
        user: this.userResponse(userFound),
      };
    }

    const newUser = await this.usersService.create(user);

    return {
      accessToken: await this.generateJwt(newUser.id),
      user: this.userResponse(newUser),
    };
  }

  userResponse(userFound: Loaded<User, never, '*', never>): UserLoginResponse {
    return {
      id: userFound.id,
      updatedAt: userFound.updatedAt,
      createdAt: userFound.createdAt,
      username: userFound.username,
      email: userFound.email,
      picture: userFound.picture,
    };
  }

  async generateJwt(userId: number) {
    const payload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }
}
