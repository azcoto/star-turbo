import { NextFunction } from 'express';
import { z } from 'zod';
import { ChangePasswordRequest, ChangePasswordResponse } from './dto';

const schema = z.object({
  uuid: z.string(),
  oldPassword: z.string(),
  newPassword: z.string(),
});

export const validate = (req: ChangePasswordRequest, res: ChangePasswordResponse, next: NextFunction) => {
  try {
    const parsed = schema.parse(req.body);
    res.locals = parsed;
    return next();
  } catch (err) {
    return next(err);
  }
};
