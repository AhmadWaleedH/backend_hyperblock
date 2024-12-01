import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { discordCallbackSchema, connectWalletSchema } from '../utils/validation';

const router = Router();

router.get('/discord/url', AuthController.getAuthUrl);
router.post('/discord/callback', validateRequest(discordCallbackSchema), AuthController.handleCallback);

// Wallet routes
router.get('/wallet/nonce', authenticate, AuthController.getNonce);
router.post(
  '/wallet/connect',
  authenticate,
  validateRequest(connectWalletSchema),
  AuthController.connectWallet
);

export default router;