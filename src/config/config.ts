import dotenv from 'dotenv';
import { AppError } from '../middleware/error';

dotenv.config();

const requiredEnvVars = [
  'DISCORD_CLIENT_ID',
  'DISCORD_CLIENT_SECRET',
  'DISCORD_REDIRECT_URI'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new AppError(`Missing required environment variable: ${envVar}`, 500);
  }
});

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hyperblock',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      redirectUri: process.env.DISCORD_REDIRECT_URI!,
      scopes: ['identify', 'email']
    },
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID || '',
    clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
  }
};