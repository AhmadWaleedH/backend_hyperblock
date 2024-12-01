import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { DiscordService } from '../services/discord.service';
import { createJWT } from '../utils/jwt.utils';
import { AppError } from '../middleware/error';
import { WalletService } from '../services/wallet.service';

export class AuthController {
  // Get Discord OAuth URL
  static async getAuthUrl(req: Request, res: Response) {
    try {
      const url = DiscordService.getAuthUrl();
      
      res.json({
        success: true,
        data: { url }
      });
    } catch (error) {
      console.error('Get auth URL error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate auth URL'
      });
    }
  }

  // Handle Discord OAuth callback
  static async handleCallback(req: Request, res: Response) {
      try {
        const { code } = req.body;
  
        console.log('Received Discord callback with code:', code.slice(0, 10) + '...');
  
        // Get Discord user data
        const discordUser = await DiscordService.getUserData(code);
  
        console.log('Retrieved Discord user:', {
          id: discordUser.id,
          username: discordUser.username
        });
  
        // Find or create user
        let user = await User.findOne({ discordId: discordUser.id });
  
        if (!user) {
          console.log('Creating new user for Discord ID:', discordUser.id);
          user = await User.create({
            discordId: discordUser.id,
            username: discordUser.username,
            discriminator: discordUser.discriminator,
            email: discordUser.email,
            avatarUrl: discordUser.avatarUrl,
            hyperBlockPoints: 0,
            status: 'active'
          });
        } else {
          console.log('Updating existing user:', user._id);
          user.username = discordUser.username;
          user.discriminator = discordUser.discriminator;
          user.email = discordUser.email;
          user.avatarUrl = discordUser.avatarUrl;
          user.lastActive = new Date();
          await user.save();
        }
  
        // Generate JWT
        const token = createJWT({ 
          userId: user._id, 
          discordId: user.discordId 
        });
  
        res.json({
          success: true,
          data: {
            token,
            user: {
              id: user._id,
              discordId: user.discordId,
              username: user.username,
              avatarUrl: user.avatarUrl,
              hyperBlockPoints: user.hyperBlockPoints
            }
          }
        });
      } catch (error) {
        console.error('Auth callback error:', error);
        
        const statusCode = error instanceof AppError ? error.statusCode : 500;
        const message = error instanceof AppError ? error.message : 'Authentication failed';
  
        res.status(statusCode).json({
          success: false,
          error: message
        });
      }
    }

  // Connect wallet to existing Discord account
  // static async connectWallet(req: Request, res: Response) {
  //   try {
  //     const { walletAddress, signature, message } = req.body;
  //     const { discordId } = req.user!; // From auth middleware

  //     // Verify wallet signature
  //     const isValid = await DiscordService.verifyWalletSignature(
  //       walletAddress,
  //       signature,
  //       message
  //     );

  //     if (!isValid) {
  //       throw new AppError('Invalid wallet signature', 401);
  //     }

  //     // Update user with wallet
  //     const user = await User.findOneAndUpdate(
  //       { discordId },
  //       { 
  //         walletAddress: walletAddress.toLowerCase(),
  //         'mintWallets.ethereum': walletAddress.toLowerCase()
  //       },
  //       { new: true }
  //     );

  //     res.json({
  //       success: true,
  //       data: {
  //         walletAddress: user?.walletAddress
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Connect wallet error:', error);
  //     if (error instanceof AppError) {
  //       res.status(error.statusCode).json({
  //         success: false,
  //         error: error.message
  //       });
  //     } else {
  //       res.status(500).json({
  //         success: false,
  //         error: 'Failed to connect wallet'
  //       });
  //     }
  //   }
  // }
  
  static async connectWallet(req: Request, res: Response) {
      try {
        const { walletAddress, signature, message } = req.body;
        const { discordId } = req.user!; // From auth middleware
  
        console.log('Connecting wallet for user:', {
          discordId,
          walletAddress,
          signatureLength: signature.length
        });
  
        // Verify wallet signature
        const isValid = await WalletService.verifyWalletSignature(
          walletAddress,
          signature,
          message
        );
  
        if (!isValid) {
          throw new AppError('Invalid wallet signature', 401);
        }
  
        // Check if wallet is already connected to another account
        const existingWalletUser = await User.findOne({
          walletAddress: walletAddress.toLowerCase()
        });
  
        if (existingWalletUser && existingWalletUser.discordId !== discordId) {
          throw new AppError('Wallet already connected to another account', 400);
        }
  
        // Update user with wallet address
        const user = await User.findOneAndUpdate(
          { discordId },
          { 
            walletAddress: walletAddress.toLowerCase(),
            'mintWallets.ethereum': walletAddress.toLowerCase()
          },
          { new: true }
        );
  
        if (!user) {
          throw new AppError('User not found', 404);
        }
  
        console.log('Wallet connected successfully:', {
          userId: user._id,
          walletAddress: user.walletAddress
        });
  
        res.json({
          success: true,
          data: {
            discordId: user.discordId,
            walletAddress: user.walletAddress,
            mintWallets: user.mintWallets
          }
        });
      } catch (error) {
        console.error('Connect wallet error:', error);
        
        const statusCode = error instanceof AppError ? error.statusCode : 500;
        const message = error instanceof AppError ? error.message : 'Failed to connect wallet';
  
        res.status(statusCode).json({
          success: false,
          error: message
        });
      }
    }
  
    static async getNonce(req: Request, res: Response) {
      try {
        const nonce = WalletService.generateNonce();
        const message = WalletService.generateWalletMessage(nonce);
  
        res.json({
          success: true,
          data: {
            nonce,
            message
          }
        });
      } catch (error) {
        console.error('Get nonce error:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to generate nonce'
        });
      }
    }
}