import { z } from 'zod';
import { ServiceLineRequest, ServiceLineResponse } from './dto';
import { NextFunction } from 'express';

const schema = z.object({
  serviceLineNumber: z.string(),
});

export const validate = (req: ServiceLineRequest, res: ServiceLineResponse, next: NextFunction) => {
  try {
    const parsed = schema.parse(req.params);
    res.locals = parsed;
    return next();
  } catch (err) {
    return next(err);
  }
};
