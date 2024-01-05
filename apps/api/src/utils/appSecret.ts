import config from '@/config';
import { Secret } from 'jsonwebtoken';

const { appSecret } = config;
const { baktiSecret } = config;

export const checkAppSecret = (secret: Secret) => {
  if (secret === appSecret) return true;
  return false;
};

export const checkBaktiSecret = (secret: Secret) => {
  if (secret === baktiSecret) return true;
  return false;
};
