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

export const getServiceLine = async (serviceLineNumber: string) => {
  // add delay 2 second
  await new Promise(resolve => setTimeout(resolve, 2000));
  const { data } = await ax.get<ServiceLineResponse>(`/service-line/${serviceLineNumber}`);
  return data.data;
};
