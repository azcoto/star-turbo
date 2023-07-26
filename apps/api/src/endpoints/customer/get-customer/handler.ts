import { ApiError } from '@/api-error';
import { CustomerRequest, CustomerResponse } from './dto';
import { NextFunction } from 'express';
import { DrizzleError, eq, and, isNotNull, sql, inArray } from 'drizzle-orm';
import { dbStarspace, endCustomer, user } from '@/db/schema/starspace';
import { dbFulfillment, vMasterNodelinkStarlink } from '@/db/schema/3easy';
import { dbStarlink, subscriptions, telemetry, terminals } from '@/db/schema/starlink';
import config from '@/config';
import { compareDesc } from 'date-fns';

const { fulfillmentConnStr } = config;

const handler = async (req: CustomerRequest, res: CustomerResponse, next: NextFunction) => {
  const { uuid } = res.locals;
  try {
    /**
     * * DB Starspace
     * * Get user left join to end customer
     */
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

    /**
     * * DB Fulfillment
     * * Get nodelink where mCustomerId = trieasyId
     */
    const nodes = await dbFulfillment
      .select()
      .from(vMasterNodelinkStarlink)
      .where(
        and(
          eq(vMasterNodelinkStarlink.mCustomerId, result[0].trieasyId),
          isNotNull(vMasterNodelinkStarlink.serviceline)
        )
      );

    /**
     * * IF nodelink not found
     * * throw 404
     */
    if (nodes.length === 0) {
      return next(new ApiError('Nodelink not found', 404, { uuid: uuid }));
    }

    /**
     * * Prepare list of service line from v_master_nodelink_starlink
     * * Query telemetry and terminals
     */

    const slList = nodes.map(node => node.serviceline as string);

    /**
     * * get uptime and last updated from telemetry
     */
    // prettier-ignore
    const slUptimeQuery =  dbStarlink
      .select({
        serviceLineNumber: telemetry.serviceLineNumber,
        lastUpdated: sql`max(${telemetry.ts})`,
        uptimeFormatted: sql`max(${telemetry.uptime})`,
      })
      .from(telemetry)
      .where(
        and(
          sql`${telemetry.ts} >= NOW() - INTERVAL '7 days'`,
          inArray(telemetry.serviceLineNumber, slList)
        )
      )
      .groupBy(telemetry.serviceLineNumber)

    /**
     * * Get current kit sn from terminals
     */
    //prettier-ignore
    const currentTerminalsQuery =  dbStarlink
      .select({
        serviceLineNumber: terminals.serviceLineNumber,
        kitSerialNumber: terminals.kitSerialNumber,
        startDate : subscriptions.startDate,
      })
      .from(terminals)
      .leftJoin(subscriptions, eq(terminals.serviceLineNumber, subscriptions.serviceLineNumber))
      .where(
        and(
          inArray(terminals.serviceLineNumber, slList),
          eq(terminals.active, true),
          isNotNull(terminals.serviceLineNumber),
        )
      );

    const [slUptime, currentTerminals] = await Promise.all([slUptimeQuery, currentTerminalsQuery]);

    /**
     * * Compose response Data
     */
    const mergedData = nodes.map(node => {
      const uptime = slUptime.find(sl => sl.serviceLineNumber === node.serviceline);
      const currentKit = currentTerminals.find(terminals => terminals.serviceLineNumber === node.serviceline);
      return {
        ...node,
        currentKitSerialNumber: currentKit ? currentKit.kitSerialNumber : null,
        starDate: currentKit ? currentKit.startDate : null,
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
          up: mergedData.filter(node => node.lastUpdated !== null).length,
          down: mergedData.filter(node => node.lastUpdated === null).length,
          inactive: mergedData.filter(node => node.currentKitSerialNumber === null).length,
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
