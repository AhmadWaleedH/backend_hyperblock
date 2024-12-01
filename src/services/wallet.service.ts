import { ethers } from 'ethers';
import { AppError } from '../middleware/error';

export class WalletService {
  static async verifyWalletSignature(
    walletAddress: string,
    signature: string,
    message: string
  ): Promise<boolean> {
    try {
      console.log('Verifying wallet signature:', {
        address: walletAddress,
        message,
        signature: signature.slice(0, 10) + '...'
      });

      // Recover the address from the signature
      const recoveredAddress = ethers.verifyMessage(message, signature);

      // Compare addresses (case-insensitive)
      const isValid = recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
      
      console.log('Signature verification result:', {
        recovered: recoveredAddress,
        valid: isValid
      });

      return isValid;
    } catch (error) {
      console.error('Wallet signature verification error:', error);
      return false;
    }
  }

  static generateWalletMessage(nonce: string): string {
    return `Welcome to HyperBlock!\n\nSign this message to verify your wallet ownership.\nThis will not trigger any blockchain transaction.\n\nNonce: ${nonce}`;
  }

  static generateNonce(): string {
    return Math.floor(Math.random() * 1000000).toString();
  }
}