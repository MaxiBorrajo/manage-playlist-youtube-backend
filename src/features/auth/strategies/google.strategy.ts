import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { User } from 'src/features/users/user.model';
import { AuthService } from '../auth.service';
import { GoogleProfile, ILogin } from '../auth.types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: `${configService.get<string>('APPLICATION_URL')}/auth/google/redirect`,
      scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube'],
      state: false,
      passReqToCallback: true,
    });
  }

  authorizationParams(): { [key: string]: string } {
    return {
      access_type: 'offline',
      prompt: 'consent',
    };
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ) {
    const { _json } = profile;
    const login: ILogin = {
      googleId: _json.sub,
      username: _json.name,
      email: _json.email,
      picture: _json.picture,
      googleAccessToken: accessToken,
      googleRefreshToken: refreshToken,
    };
    const credentials = await this.authService.handleLogin(login);
    done(null, credentials);
  }
}
