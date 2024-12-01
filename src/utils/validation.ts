import { z } from 'zod';

export const connectWalletSchema = z.object({
  body: z.object({
    walletAddress: z.string()
      .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format')
      .transform(addr => addr.toLowerCase()),
    signature: z.string()
      .min(1, 'Signature is required')
      .regex(/^0x[a-fA-F0-9]+$/, 'Invalid signature format'),
    message: z.string()
      .min(1, 'Message is required')
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const connectSocialSchema = z.object({
  body: z.object({
    code: z.string().min(1),
    redirectUri: z.string().url()
  }),
  params: z.object({
    platform: z.enum(['discord', 'twitter'])
  })
});

// Discord callback validation
export const discordCallbackSchema = z.object({
  body: z.object({
    code: z.string({
      required_error: "Discord OAuth code is required"
    }).min(1, "Code cannot be empty")
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

// Update profile validation
export const updateProfileSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    mintWallets: z.object({
      ethereum: z.string()
        .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')
        .optional(),
      solana: z.string().optional()
    }).optional()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

// Export types for use in controllers
export type DiscordCallbackInput = z.infer<typeof discordCallbackSchema>;
export type ConnectWalletInput = z.infer<typeof connectWalletSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ConnectSocialInput = z.infer<typeof connectSocialSchema>['body'];
