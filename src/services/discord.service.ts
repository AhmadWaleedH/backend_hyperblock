import axios from 'axios';
import { config } from '../config/config';
import { AppError } from '../middleware/error';

export class DiscordService {
  static getAuthUrl(): string {
    if (!config.discord.clientId || !config.discord.redirectUri) {
      throw new AppError('Discord configuration is missing', 500);
    }

    const params = new URLSearchParams({
      client_id: config.discord.clientId,
      redirect_uri: config.discord.redirectUri,
      response_type: 'code',
      scope: 'identify email'
    });

    console.log('Discord Auth URL Parameters:', {
      clientId: config.discord.clientId,
      redirectUri: config.discord.redirectUri
    });

    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  }

  static async getUserData(code: string) {
    try {
      console.log('Attempting to exchange code for token with params:', {
        clientId: config.discord.clientId,
        redirectUri: config.discord.redirectUri,
        code: code.slice(0, 10) + '...' // Log partial code for debugging
      });

      // Exchange code for token
      const tokenResponse = await axios.post(
        'https://discord.com/api/oauth2/token',
        new URLSearchParams({
          client_id: config.discord.clientId,
          client_secret: config.discord.clientSecret,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: config.discord.redirectUri
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );

      console.log('Token exchange successful');

      const { access_token } = tokenResponse.data;

      // Get user data with the token
      const userResponse = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });

      console.log('Successfully retrieved user data');

      return {
        id: userResponse.data.id,
        username: userResponse.data.username,
        discriminator: userResponse.data.discriminator,
        email: userResponse.data.email,
        avatarUrl: userResponse.data.avatar 
          ? `https://cdn.discordapp.com/avatars/${userResponse.data.id}/${userResponse.data.avatar}.png`
          : null
      };
    } catch (error: any) {
      console.error('Discord API Error Details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });

      // More specific error messages based on the error
      if (error.response?.status === 401) {
        throw new AppError('Invalid Discord credentials', 401);
      }
      if (error.response?.status === 400) {
        throw new AppError('Invalid authorization code', 400);
      }
      
      throw new AppError(
        `Failed to authenticate with Discord: ${error.response?.data?.error || error.message}`,
        error.response?.status || 500
      );
    }
  }
}