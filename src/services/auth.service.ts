import { ethers } from 'ethers';
import axios from 'axios';
import { config } from '../config/config';
import { AppError } from '../middleware/error';

export class AuthService {
  static async verifyWalletSignature(
    address: string,
    signature: string,
    message: string
  ): Promise<boolean> {
    try {
      // Normalize the address to checksum format
      const normalizedAddress = ethers.getAddress(address);
      
      // Recover the address from the signature
      const recoveredAddress = ethers.verifyMessage(message, signature);
      
      // Compare the addresses (case-insensitive)
      return normalizedAddress.toLowerCase() === recoveredAddress.toLowerCase();
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  static generateNonce(): string {
    return Math.floor(Math.random() * 1000000).toString();
  }

  static generateSignMessage(nonce: string): string {
    return `Welcome to HyperBlock!\n\nPlease sign this message to verify your wallet ownership.\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nNonce: ${nonce}`;
  }

  static async getSocialProfile(
    platform: string,
    code: string,
    redirectUri: string
  ) {
    switch (platform) {
      case 'discord':
        return await this.getDiscordProfile(code, redirectUri);
      case 'twitter':
        return await this.getTwitterProfile(code, redirectUri);
      default:
        throw new AppError('Unsupported platform', 400);
    }
  }

  private static async getDiscordProfile(code: string, redirectUri: string) {
    try {
      // Get Discord access token
      const tokenResponse = await axios.post(
        'https://discord.com/api/oauth2/token',
        new URLSearchParams({
          client_id: config.discord.clientId,
          client_secret: config.discord.clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      // Get user profile
      const userResponse = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`,
        },
      });

      return {
        id: userResponse.data.id,
        username: userResponse.data.username,
        discriminator: userResponse.data.discriminator,
        avatarUrl: `https://cdn.discordapp.com/avatars/${userResponse.data.id}/${userResponse.data.avatar}.png`,
      };
    } catch (error) {
      console.error('Discord profile error:', error);
      throw new AppError('Failed to get Discord profile', 500);
    }
  }

  private static async getTwitterProfile(code: string, redirectUri: string) {
    try {
      // Get Twitter access token
      const tokenResponse = await axios.post(
        'https://api.twitter.com/2/oauth2/token',
        new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          client_id: config.twitter.clientId,
          redirect_uri: redirectUri,
          code_verifier: 'challenge',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          auth: {
            username: config.twitter.clientId,
            password: config.twitter.clientSecret,
          },
        }
      );

      // Get user profile
      const userResponse = await axios.get(
        'https://api.twitter.com/2/users/me',
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.data.access_token}`,
          },
        }
      );

      return {
        id: userResponse.data.id,
        username: userResponse.data.username,
        profileUrl: `https://twitter.com/${userResponse.data.username}`,
      };
    } catch (error) {
      console.error('Twitter profile error:', error);
      throw new AppError('Failed to get Twitter profile', 500);
    }
  }
}