import { NextFunction } from 'express';
import { z } from 'zod';
import { CustomerParams, CustomerRequest, CustomerResponse } from './dto';

const schema = z.object({
  uuid: z.string(),
});

const schemaQuery = z.object({
  format: z.string().optional(),
});

export const validate = (req: CustomerRequest, res: CustomerResponse, next: NextFunction) => {
  try {
    const parsed = schema.parse(req.params);
    const parsedQuery = schemaQuery.parse(req.query);
    res.locals = parsed;
    res.locals.format = parsedQuery.format;
    return next();
  } catch (err) {
    return next(err);
  }
};

export default validate;
