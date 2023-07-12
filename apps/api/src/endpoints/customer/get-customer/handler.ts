import { ApiError } from '@/api-error';
import { CustomerRequest, CustomerResponse } from './dto';
import { NextFunction } from 'express';
import { DrizzleError, eq, and, isNotNull, sql, inArray } from 'drizzle-orm';
import { dbStarspace, endCustomer, user } from '@/db/schema/starspace';
import { dbFulfillment, vMasterNodelinkStarlink } from '@/db/schema/3easy';
import { dbStarlink, telemetry } from '@/db/schema/starlink';

const handler = async (req: CustomerRequest, res: CustomerResponse, next: NextFunction) => {
  const { uuid } = res.locals;
  try {
    // prettier-ignore
    const result = await dbStarspace
      .select({
        id: user.id,
        trieasyId: endCustomer.trieasyId,
        fullName: user.fullName,
        endCustomerName : endCustomer.name,
      })
      .from(user)
      .leftJoin(endCustomer, eq(user.endCustomerId, endCustomer.id))
      .where(eq(user.uuid, uuid))

    if (result.length === 0 || result[0].trieasyId === null) {
      return next(new ApiError('User not found', 404, { uuid: uuid }));
    }

    const nodes = await dbFulfillment
      .select()
      .from(vMasterNodelinkStarlink)
      .where(
        and(
          eq(vMasterNodelinkStarlink.mCustomerId, result[0].trieasyId),
          isNotNull(vMasterNodelinkStarlink.serviceline)
        )
      );

    if (nodes.length === 0) {
      return next(new ApiError('Nodelink not found', 404, { uuid: uuid }));
    }

    const slList = nodes.map(node => node.serviceline as string);

    // prettier-ignore
    const slUptime = await dbStarlink
      .select({
        serviceLineNumber: telemetry.serviceLineNumber,
        lastUpdated: sql`max(${telemetry.ts}::timestamp at time zone 'UTC+7')`,
        uptimeFormatted: sql`max(${telemetry.uptime})`,
      })
      .from(telemetry)
      .where(
        and(
          sql`${telemetry.ts} >= NOW() - INTERVAL '20 minutes'`,
          inArray(telemetry.serviceLineNumber, slList)
        )
      )
      .groupBy(telemetry.serviceLineNumber)

    const mergedData = nodes.map(node => {
      const uptime = slUptime.find(sl => sl.serviceLineNumber === node.serviceline);
      return {
        ...node,
        uptime: uptime ? uptime.uptimeFormatted : null,
        lastUpdated: uptime ? uptime.lastUpdated : null,
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Get Customer',
      data: {
        ...result[0],
        nodes: {
          count: mergedData.length,
          data: mergedData,
        },
      },
    });
  } catch (err) {
    if (err instanceof DrizzleError) {
      return next(new ApiError('ORM Error', 500, { message: err.message }));
    }
    if (err instanceof Error) return next(new ApiError('Internal Server Error', 500, { message: err.message }));
  }
};

export default handler;
