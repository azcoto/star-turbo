import { and, desc, eq, sql } from 'drizzle-orm';
import { dbStarlink, nodeBtsBakti, telemetry } from '@/db/schema/starlink';
import { TelemetryRequest, TelemetryResponse } from './dtos';

export const handler = async (req: TelemetryRequest, res: TelemetryResponse) => {
  const { start, end, idNode } = res.locals;
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

  const query = dbStarlink
    .select({
      ts: sql<string>`time_bucket(${bucketSize}, telemetry.ts)`.as('tsb'),
      downlinkThroughput: sql<number>`avg(telemetry.downlink_throughput)`.as('downlinkThroughput'),
      uplinkThroughput: sql<number>`avg(telemetry.uplink_throughput)`.as('uplinkThroughput'),
      signalQuality: sql<number>`avg(telemetry.signal_quality)`.as('signalQuality'),
      pingLatencyMsAvg: sql<number>`CAST(avg(telemetry.ping_latency_ms_avg) as INTEGER)`.as('pingLatencyMsAvg'),
      pingDropRateAvg: sql<number>`avg(telemetry.ping_drop_rate_avg)`.as('pingDropRateAvg'),
      obstructionPercentTime: sql<number>`avg(telemetry.obstruction_percent_time)`.as('obstructionPercentTime'),
    })
    .from(nodeBtsBakti)
    .innerJoin(telemetry, eq(nodeBtsBakti.serviceLineNumber, telemetry.serviceLineNumber))
    .where(and(sql`telemetry.ts BETWEEN ${startDate} AND ${endDate}`, eq(nodeBtsBakti.id, idNode.toString())))
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
