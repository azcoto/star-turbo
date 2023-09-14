import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/jwt';
import { checkAppSecret } from '@/utils/appSecret';

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const bearerOrSecret = req.headers.authorization?.split(' ')[0];
  const token = req.headers.authorization?.split(' ')[1];
  if (token && bearerOrSecret === 'Secret') {
    if (checkAppSecret(token)) return next();
    return res.status(401).json({ status: false, message: 'Unauthorized App' });
  }
  if (!token) {
    return res.status(401).json({ status: false, message: 'Unauthorized' });
  }
  try {
    const isValid = verifyToken(token);
    if (!isValid) {
      console.log('hit');

      return res.status(401).json({ status: false, message: 'Unauthorized' });
    }
    console.log('hit');

    next();
  } catch (err) {
    return res.status(401).json({ status: false, message: 'Unauthorized' });
  }
};
