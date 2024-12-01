import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export const createJWT = (payload: object): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

export const verifyJWT = (token: string): any => {
  return jwt.verify(token, config.jwtSecret);
};

export const createTestJWT = (userId: string) => {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: '1d', // Set a short expiration for test tokens
  });
};