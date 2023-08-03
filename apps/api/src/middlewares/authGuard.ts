import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/jwt';

const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ status: false, message: 'Unauthorized' });
  }
  const isValid = verifyToken(token);
  if (!isValid) {
    return res.status(401).json({ status: false, message: 'Unauthorized' });
  }
  next();
};
