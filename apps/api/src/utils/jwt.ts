import config from '@/config';
import jsonwebtoken, { verify } from 'jsonwebtoken';

const { sign } = jsonwebtoken;
const { accessTokenSecret } = config;

export const encodeAccessToken = (payload: Record<string, unknown>) => {
  return sign(payload, accessTokenSecret, { algorithm: 'HS256' });
};

export const verifyToken = (token: string) => {
  return verify(token, accessTokenSecret);
};
