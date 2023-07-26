import { NextFunction, Request, Response } from 'express';
import { ServiceLineRequest, ServiceLineResponse } from './dto';
import { addressLine, dbStarlink, serviceLine, telemetry, terminals } from '@/db/schema/starlink';
import { DrizzleError, and, desc, eq, sql } from 'drizzle-orm';
import { ApiError } from '@/api-error';

const handler = async (req: ServiceLineRequest, res: ServiceLineResponse, next: NextFunction) => {
  const { serviceLineNumber } = res.locals;
  try {
    // prettier-ignore
    const result = await dbStarlink
    .select({
      uptimeFormatted: sql`to_char(justify_hours(interval '1 sec' * ${telemetry.uptime}), 'FMDD" DAYS "HH24" HOURS "MI" MINUTES')`,
      lastUpdated : telemetry.ts,
      checkOnline : sql`AGE(now(), ${telemetry.ts} ) < interval '15 minutes'`
    })
    .from(telemetry)
    .where(
      and(
        sql`${telemetry.ts} >= NOW() - INTERVAL '1 Month'`,
        eq(telemetry.serviceLineNumber, serviceLineNumber)
      )
    )
    .orderBy(desc(telemetry.ts))
    .limit(1);

    const dataUptime = result[0]
      ? result[0]
      : {
          uptimeFormatted: null,
          lastUpdated: null,
          checkOnline: false,
        };
    res.status(200).json({
      success: true,
      message: 'Success',
      data: dataUptime,
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
