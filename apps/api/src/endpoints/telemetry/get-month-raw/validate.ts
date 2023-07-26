import { NextFunction } from 'express';
import { z } from 'zod';
import { RawDataRequest, RawDataResponse } from './dtos';

const schema = z.object({
  serviceLine: z.string().min(1).max(20),
  month: z.coerce.number().int().lte(12).gte(1),
  year: z.coerce.number().int().gte(2023),
});

export const validate = (req: RawDataRequest, res: RawDataResponse, next: NextFunction) => {
  try {
    const parsed = schema.parse(req.query);
    res.locals = parsed;
    return next();
  } catch (err) {
    return next(err);
  }
};
