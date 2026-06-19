import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  expiresIn: process.env.JWT_EXPIRATION || '15m',
  refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'your-super-secret-refresh-key',
  refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
}));
