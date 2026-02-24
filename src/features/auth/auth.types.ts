export interface ILogin {
  googleId: string;
  username: string;
  email: string;
  picture: string;
  googleAccessToken: string;
  googleRefreshToken: string;
}

export interface GoogleProfile {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: { value: string; verified: boolean }[];
  photos: { value: string }[];
  provider: 'google';
  _raw: string;
  _json: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
  };
}

export type JwtPayload = { sub: string }

export type JwtUser = {
  id: number;
  googleId: string;
  googleAccessToken: string;
  googleRefreshToken: string;
}

export interface UserLoginResponse {
   id: number;
   updatedAt?: Date;
   createdAt?: Date;
   username: string;
   email: string;
   picture?: string;
}