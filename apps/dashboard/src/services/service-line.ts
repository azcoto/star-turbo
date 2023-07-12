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
  latitude: 3.286096;
  longitude: 99.109859;
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
  lastUpdated: string | null;
  checkOnline: boolean;
};

export const getServiceLine = async (serviceLineNumber: string) => {
  // add delay 2 second
  const { data } = await ax.get<ServiceLineResponse>(`/service-line/${serviceLineNumber}`);
  return data.data;
};

export const getUptime = async (serviceLineNumber: string) => {
  const { data } = await ax.get<UptimeResponse>(`/service-line/uptime/${serviceLineNumber}`);
  return data.data;
};
