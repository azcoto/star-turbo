import ax from './axios';
import { z } from 'zod';

export type TelemetryQuery = {
  terminalId: string;
  start: Date;
  end: Date;
};

export type TelemetryResponse = {
  success: boolean;
  message: string;
  count: number;
  data: TelemetryData[];
};

export type TelemetryData = {
  ts: Date;
  downlinkThroughput: number;
  uplinkThroughput: number;
  signalQuality: number;
  pingLatencyMsAvg: number;
  pingDropRateAvg: number;
  obstructionPercentTime: number;
};

const schema = z.array(
  z.object({
    ts: z.coerce.date(),
    downlinkThroughput: z.number(),
    uplinkThroughput: z.number(),
    signalQuality: z.number(),
    pingLatencyMsAvg: z.number(),
    pingDropRateAvg: z.number(),
    obstructionPercentTime: z.number(),
  })
);

export const getTelemetry = async (query: TelemetryQuery) => {
  const { terminalId, start, end } = query;
  // convert date to epoch

  const { data } = await ax.get<TelemetryResponse>(
    `/telemetry?terminalId=${terminalId}&start=${start.valueOf()}&end=${end.valueOf()}`
  );
  return schema.parse(data.data);
};
