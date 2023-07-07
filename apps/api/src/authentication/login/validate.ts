import { NextFunction } from 'express';
import { z } from 'zod';
import { LoginRequest, LoginResponse } from './dto';

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export const validate = (req: LoginRequest, res: LoginResponse, next: NextFunction) => {
  try {
    const parsed = schema.parse(req.query);
    res.locals = parsed;
    return next();
  } catch (err) {
    return next(err);
  }
};
