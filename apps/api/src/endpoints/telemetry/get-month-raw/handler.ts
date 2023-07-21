import { and, desc, eq, sql } from 'drizzle-orm';
import { dbStarlink, telemetry } from '@/db/schema/starlink';
import { RawDataRequest, RawDataResponse } from './dtos';
import { addHours, format, parse, subMonths, toDate } from 'date-fns';
import { stringify } from 'csv-stringify/sync';

export const handler = async (req: RawDataRequest, res: RawDataResponse) => {
  const { month, year, serviceLine: serviceLineNumber } = res.locals;

  const nDate = toDate(new Date(year, month, 1));
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
        sql`ts >= ${subMonths(nDate, 1)}::timestamp AT TIME ZONE 'Asia/Jakarta'`,
        sql`ts <  ${nDate}::timestamp AT TIME ZONE 'Asia/Jakarta'`,
        eq(telemetry.serviceLineNumber, serviceLineNumber)
      )
    )
    .orderBy(desc(sql`tsb`))
    .groupBy(sql`tsb`);
  const result = await query;

  const normalized = result.map(row => {
    const normalizeToJakarta = addHours(parse(row.ts, 'yyyy-MM-dd HH:mm:ss' + 'X', new Date()), 7);
    const formatExcel = format(normalizeToJakarta, 'yyyy-MM-dd HH:mm:ss');
    return {
      time: formatExcel,
      // round to 2 decimal
      downlinkThroughputbps: row.downlinkThroughput !== null ? Math.round(row.downlinkThroughput * 1000000) : null,
      uplinkThroughputbps: row.uplinkThroughput !== null ? Math.round(row.uplinkThroughput * 1000000) : null,
      latencyms: row.pingLatencyMsAvg !== null ? row.pingLatencyMsAvg : null,
      pingDropRate: row.pingDropRateAvg !== null ? row.pingDropRateAvg * 100 : null,
      signalQuality: row.signalQuality !== null ? row.signalQuality * 100 : null,
      obstructionPercentTime: row.obstructionPercentTime !== null ? row.obstructionPercentTime : null,
    };
  });
  const csv = stringify(normalized, { header: true });
  res.setHeader('Content-Disposition', `attachment;filename=telemetry-${serviceLineNumber}-${year}-${month}.csv`);
  res.setHeader('Content-Type', 'text/csv');
  return res.status(200).send(csv);
};
