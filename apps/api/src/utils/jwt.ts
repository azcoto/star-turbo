import config from '@/config';
import jsonwebtoken from 'jsonwebtoken';

const { sign } = jsonwebtoken;
const { accessTokenSecret } = config;

export const encodeAccessToken = (payload: Record<string, unknown>) => {
  return sign(payload, accessTokenSecret, { algorithm: 'HS256', expiresIn: '1h' });
};
