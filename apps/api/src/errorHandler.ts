import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const errorHandler = async (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.log('CAUGHT');
  if (err instanceof z.ZodError) {
    res.status(400);
    return res.json({
      sucess: false,
      message: 'Validation Error',
      data: err.issues,
    });
  }
  res.status(500);
  return res.json({
    success: false,
    message: 'Internal Server Error',
    data: err.message,
  });
};
