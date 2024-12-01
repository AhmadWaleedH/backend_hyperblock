import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { z } from 'zod';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
      }
      next(error);
    }
  };
};
export const discordCallbackSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Discord OAuth code is required')
  })
});

// export const connectWalletSchema = z.object({
//   body: z.object({
//     walletAddress: z.string()
//       .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
//     signature: z.string()
//       .regex(/^0x[a-fA-F0-9]{130}$/, 'Invalid signature format'),
//     message: z.string().min(1, 'Message is required')
//   })
// });

export const updateProfileSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    mintWallets: z.object({
      ethereum: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
      solana: z.string().optional()
    }).optional()
  })
});