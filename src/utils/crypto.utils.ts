import crypto from 'crypto';

export const generateNonce = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateSignatureMessage = (nonce: string): string => {
  return `Welcome to HyperBlock!\n\nClick to sign in and accept the HyperBlock Terms of Service.\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nNonce: ${nonce}`;
};