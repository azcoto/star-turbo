import { NextFunction } from 'express';
import { z } from 'zod';
import { TelemetryRequest, TelemetryResponse } from './dtos';

const schema = z.object({
  terminalId: z.string(),
  start: z.coerce.number().int(),
  end: z.coerce.number().int(),
});

export const validate = (req: TelemetryRequest, res: TelemetryResponse, next: NextFunction) => {
  try {
    const parsed = schema.parse(req.query);
    res.locals = parsed;
    return next();
  } catch (err) {
    return next(err);
  }
};
