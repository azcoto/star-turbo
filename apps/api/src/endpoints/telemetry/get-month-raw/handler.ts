import { and, desc, eq, sql } from 'drizzle-orm';
import { dbStarlink, telemetry } from '@/db/schema/starlink';
import { RawDataRequest, RawDataResponse } from './dtos';
import { getMonth, subMonths } from 'date-fns';
export const handler = async (req: RawDataRequest, res: RawDataResponse) => {
  const { month, year, serviceLine: serviceLineNumber } = res.locals;

  const nDate = new Date(year, month, 1);
  // epoch to date
  // prettier-ignore
  const query = dbStarlink
    .select({
      ts: sql<string>`time_bucket_gapfill('5m', ts)`.as('tsb'),
      downlinkThroughput: sql<number>`avg(downlink_throughput)`.as('downlinkThroughput'),
      uplinkThroughput: sql<number>`avg(uplink_throughput)`.as('uplinkThroughput'),
      signalQuality: sql<number>`avg(signal_quality)`.as('signalQuality'),
      pingLatencyMsAvg: sql<number>`CAST(avg(ping_latency_ms_avg) as INTEGER)`.as('pingLatencyMsAvg'),
      pingDropRateAvg: sql<number>`avg(ping_drop_rate_avg)`.as('pingDropRateAvg'),
      obstructionPercentTime: sql<number>`avg(obstruction_percent_time)`.as('obstructionPercentTime'),
    })
    .from(telemetry)
    .where(
      and(
        sql`ts >= ${nDate}`, 
        sql`ts <  ${subMonths(nDate,1)}`, 
        eq(telemetry.serviceLineNumber, serviceLineNumber)
      )
    )
    .orderBy(desc(sql`tsb`))
    .groupBy(sql`tsb`);

  const result = await query;
  return res.json({
    success: true,
    message: 'Success!',
    count: result.length,
    data: result,
  });
};
