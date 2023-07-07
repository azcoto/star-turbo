import { NextFunction, Request } from 'express';
import { z } from 'zod';
import { LoginRequest, LoginResponse } from './dto';

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export const validate = (req: Request, res: LoginResponse, next: NextFunction) => {
  try {
    const parsed = schema.parse(req.body);
    res.locals = parsed;
    return next();
  } catch (err) {
    return next(err);
  }
};
