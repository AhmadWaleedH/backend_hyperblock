import { config } from '../config/config';

export function validateDiscordConfig() {
  const requiredConfig = [
    'DISCORD_CLIENT_ID',
    'DISCORD_CLIENT_SECRET',
    'DISCORD_REDIRECT_URI'
  ];

  const missingConfig = requiredConfig.filter(key => !process[key]);

  if (missingConfig.length > 0) {
    console.error('Missing required Discord configuration:', missingConfig);
    process.exit(1);
  }

  console.log('Discord configuration validated successfully:', {
    clientId: config.discord.clientId,
    redirectUri: config.discord.redirectUri
  });
}