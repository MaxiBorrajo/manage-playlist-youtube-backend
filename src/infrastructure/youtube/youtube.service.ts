import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class YoutubeService {
  constructor(private readonly configService: ConfigService) {}
  async generateAuthClient(access_token: string, refresh_token: string) {
    console.log(access_token, refresh_token);
    const auth = new google.auth.OAuth2({
      client_id: this.configService.get<string>('GOOGLE_CLIENT_ID')!,
      client_secret: this.configService.get<string>('GOOGLE_CLIENT_SECRET')!,
      redirectUri: `${this.configService.get<string>('APPLICATION_URL')}/auth/google/redirect`,
    });

    /**
     * Para refrescar token
     * oauth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    // store the refresh_token in my database!
    console.log(tokens.refresh_token);
  }
  console.log(tokens.access_token);
});
     */

    auth.setCredentials({
      access_token,
      refresh_token,
    });

    return auth;
  }

  async getPlaylists(accessToken: string, refreshToken: string)
  {
    const service = google.youtube('v3');
    const auth = await this.generateAuthClient(accessToken, refreshToken);
    const response = await service.playlists.list({
      part: ['snippet', 'contentDetails',  'status', 'id'],
      mine: true,
      auth,
    });
    return response.data;
  }
}
