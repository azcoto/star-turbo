import config from '@/config';
import { sign } from 'jsonwebtoken';

const { accessTokenSecret } = config;

export const encodeAccessToken = (payload: Record<string, unknown>) => {
  return sign(payload, accessTokenSecret, { algorithm: 'HS256', expiresIn: '1h' });
};
