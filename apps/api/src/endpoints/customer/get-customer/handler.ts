import { ApiError } from '@/api-error';
import { CustomerRequest, CustomerResponse } from './dto';
import { NextFunction } from 'express';
import { DrizzleError, eq, and, isNotNull, sql, inArray } from 'drizzle-orm';
import { dbStarspace, endCustomer, user } from '@/db/schema/starspace';
import { dbFulfillment, vMasterNodelinkStarlink } from '@/db/schema/3easy';
import { dbStarlink, subscriptions, telemetryLastUpdate, terminals } from '@/db/schema/starlink';
import config from '@/config';
import { parseISO, differenceInMinutes } from 'date-fns';
import { stringify } from 'csv-stringify/sync';

const { fulfillmentConnStr } = config;

const handler = async (req: CustomerRequest, res: CustomerResponse, next: NextFunction) => {
  const { uuid, format } = res.locals;
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
    const qNodes = dbFulfillment.select().from(vMasterNodelinkStarlink);

    if (result[0].trieasyId !== 0) {
      qNodes.where(
        and(
          eq(vMasterNodelinkStarlink.mCustomerId, result[0].trieasyId),
          isNotNull(vMasterNodelinkStarlink.serviceline)
        )
      );
    } else {
      qNodes.where(isNotNull(vMasterNodelinkStarlink.serviceline));
    }

    const nodes = await qNodes;

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
        serviceLineNumber: telemetryLastUpdate.serviceLineNumber,
        lastUpdated: sql<string | null>`${telemetryLastUpdate.lastUpdated}`,
      })
      .from(telemetryLastUpdate)
      .where(
          inArray(telemetryLastUpdate.serviceLineNumber, slList)
      )

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
        active: currentKit ? true : false,
        currentKitSerialNumber: currentKit ? currentKit.kitSerialNumber : null,
        starDate: currentKit ? currentKit.startDate : null,
        // uptime: uptime ? uptime.uptimeFormatted : null,
        lastUpdated: uptime ? uptime.lastUpdated : null,
      };
    });
    if (format && format === 'csv') {
      const refinedData = mergedData.map(node => {
        return {
          nama: node.namaNodelink,
          snKit: node.currentKitSerialNumber ?? '',
          layanan: node.layanan ?? '',
          serviceLine: node.serviceline ?? '',
          lastUpdated: node.lastUpdated ?? '',
        };
      });
      const csv = stringify(refinedData, { header: true });
      res.setHeader('Content-Disposition', `attachment;filename=customer.csv`);
      res.setHeader('Content-Type', 'text/csv');
      return res.status(200).send(csv);
    }
    return res.status(200).json({
      success: true,
      message: 'Get Customer',
      data: {
        ...result[0],
        nodes: {
          up: mergedData.filter(node => {
            if (node.lastUpdated === null) return false;
            const isUp = node.lastUpdated && differenceInMinutes(parseISO(node.lastUpdated), new Date()) > -15;
            return isUp;
          }).length,
          down: mergedData.filter(node => {
            if (node.lastUpdated === null) return true;
            const isDown = node.lastUpdated && differenceInMinutes(parseISO(node.lastUpdated), new Date()) < -15;
            return isDown;
          }).length,
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
