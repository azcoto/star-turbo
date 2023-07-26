import { NextFunction } from 'express';
import { z } from 'zod';
import { CustomerParams, CustomerRequest, CustomerResponse } from './dto';

const schema = z.object({
  uuid: z.string(),
});

export const validate = (req: CustomerRequest, res: CustomerResponse, next: NextFunction) => {
  try {
    const parsed = schema.parse(req.params);
    res.locals = parsed;
    return next();
  } catch (err) {
    return next(err);
  }
};

export default validate;
