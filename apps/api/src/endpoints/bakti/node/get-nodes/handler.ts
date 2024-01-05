import { ApiError } from '@/api-error';
import { NextFunction, Request, Response } from 'express';
import { DrizzleError } from 'drizzle-orm';
import { dbStarlink, nodeBtsBakti } from '@/db/schema/starlink';
import config from '@/config';

export const handler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    /**
     * *DB Telemetry
     * *Get nodelink BTS Bakti Only
     */
    const nodes = await dbStarlink
      .select({
        id: nodeBtsBakti.id,
        nama: nodeBtsBakti.nama,
      })
      .from(nodeBtsBakti);
    return res.status(200).json({
      success: true,
      message: 'Get Terminal BTS Bakti',
      data: {
        ...nodes,
      },
    });
  } catch (err) {
    console.log(err);
    if (err instanceof DrizzleError) {
      return next(new ApiError('ORM Error', 500, { message: err.message }));
    }
    if (err instanceof Error) return next(new ApiError('Internal Server Error', 500, { message: err.message }));
  }
};

export default handler;
