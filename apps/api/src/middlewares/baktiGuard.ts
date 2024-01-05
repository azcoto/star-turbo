import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/jwt';
import { checkAppSecret } from '@/utils/appSecret';

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const bearerOrSecret = req.headers.authorization?.split(' ')[0];
  const token = req.headers.authorization?.split(' ')[1];
  if (token && bearerOrSecret === 'Bearer') {
    if (checkAppSecret(token)) return next();
  }
  return res.status(401).json({ status: false, message: 'Unauthorized App' });
};
