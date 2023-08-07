import config from '@/config';
import { Secret } from 'jsonwebtoken';

const { appSecret } = config;

export const checkAppSecret = (secret: Secret) => {
  if (secret === appSecret) return true;
  return false;
};
