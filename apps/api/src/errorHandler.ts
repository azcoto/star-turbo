import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ApiError } from './api-error';

export const errorHandler = async (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof z.ZodError) {
    res.status(400);
    return res.json({
      sucess: false,
      message: 'Validation Error',
      data: err.issues,
    });
  }

  if (err instanceof ApiError && err.statusCode === 500) {
    res.status(500);
    return res.json({
      sucess: false,
      message: err.message,
      data: err.data,
    });
  }

  if (err instanceof ApiError && err.statusCode === 400) {
    res.status(400);
    return res.json({
      sucess: false,
      message: err.message,
      data: err.data,
    });
  }

  return res.status(500).json({
    sucess: false,
    message: 'Internal Server Error',
    data: err,
  });
};
