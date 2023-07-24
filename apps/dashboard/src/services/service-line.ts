import { z } from 'zod';
import ax from './axios';

export type ServiceLineResponse = {
  success: boolean;
  message: string;
  data: ServiceLineData;
};

export type ServiceLineData = {
  serviceLineNumber: string;
  nickname?: string;
  addressReferenceId: string;
  locality?: string;
  administrativeArea?: string;
  administrativeAreaCode?: string;
  region?: string;
  regionCode?: string;
  postalCode?: string;
  metadata?: string;
  formattedAddress?: string;
  latitude: number;
  longitude: number;
  userTerminalId: string;
  kitSerialNumber?: string;
  dishSerialNumber?: string;
  terminalActive: boolean;
};

type UptimeResponse = {
  success: boolean;
  message: string;
  data: Uptime;
};

type Uptime = {
  uptimeFormatted: string | null;
  lastUpdated: Date | null;
  checkOnline: boolean;
};

const uptimeSchema = z.object({
  uptimeFormatted: z.string().nullable(),
  lastUpdated: z
    .string()
    .nullable()
    .transform(value => (value ? new Date(value) : null)),
  checkOnline: z.boolean(),
});

export const getServiceLine = async (serviceLineNumber: string) => {
  // add delay 2 second
  const { data } = await ax.get<ServiceLineResponse>(`/service-line/${serviceLineNumber}`);
  return data.data;
};

export const getUptime = async (serviceLineNumber: string) => {
  const { data } = await ax.get<UptimeResponse>(`/service-line/uptime/${serviceLineNumber}`);
  const parsed = uptimeSchema.parse(data.data);

  return parsed;
};
