import { and, desc, eq, sql } from 'drizzle-orm';
import { dbStarlink, telemetry } from '@/db/schema/starlink';
import { TelemetryRequest, TelemetryResponse } from './dtos';

export const handler = async (req: TelemetryRequest, res: TelemetryResponse) => {
  console.log('req.body', res.locals);
  const { start, end, serviceLineNumber } = res.locals;
  // epoch to date
  const startDate = new Date(start);
  const endDate = new Date(end);
  /*
   * * Calculate bucket size
   * * If delta less than 1 hour then bucket size 15s
   * * else delta in second / 3600s floored muliply by 15 second
   */
  const delta = (end - start) / 1000;
  const mult = Math.floor(delta / 3600) * 15;
  const bucketSize = mult ? `${mult}s` : `15s`;
  console.log(delta, mult, bucketSize);
  console.log(serviceLineNumber);
  // prettier-ignore
  const query = dbStarlink
    .select({
      ts: sql<string>`time_bucket(${bucketSize}, ts)`.as('tsb'),
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
        sql`ts BETWEEN ${startDate} AND ${endDate}`, 
        eq(telemetry.serviceLineNumber, serviceLineNumber)
      )
    )
    .orderBy(desc(sql`tsb`))
    .groupBy(sql`tsb`);

  console.log(query.toSQL());
  const result = await query;
  return res.json({
    success: true,
    message: 'Success!',
    count: result.length,
    data: result,
  });
};
