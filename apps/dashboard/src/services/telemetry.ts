import ax from './axios';
import { z } from 'zod';

export type TelemetryQuery = {
  serviceLineNumber: string;
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
  const { serviceLineNumber, start, end } = query;
  // convert date to epoch
  const { data } = await ax.get<TelemetryResponse>(
    `/telemetry?serviceLineNumber=${serviceLineNumber}&start=${start.valueOf()}&end=${end.valueOf()}`
  );
  return schema.parse(data.data);
};

type RawDataQuery = {
  serviceLine: string;
  month: number;
  year: number;
};

export const getRawData = async (query: RawDataQuery) => {
  const { serviceLine, month, year } = query;
  // convert date to epoch
  const response = await ax.get(`/telemetry/raw-data?serviceLine=${serviceLine}&month=${month}&year=${year}`, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(response.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = `telemetry-${serviceLine}-${year}-${month}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};
