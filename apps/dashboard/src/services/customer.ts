import ax from './axios';
import { z } from 'zod';

export type CustomerResponse = {
  success: boolean;
  message: string;
  data: CustomerData;
};

export type CustomerData = {
  id: number;
  trieasyId: number;
  fullName: string;
  endCustomerName: string;
  nodes: Nodes;
};

export type Nodes = {
  up: number;
  down: number;
  count: number;
  inactive: number;
  data: Node[];
};

export type Node = {
  mNodelinkId: number;
  mCustomerId: number;
  namaCustomer: string;
  sid: string;
  starlinkSid: string;
  namaNodelink: string;
  layanan: string;
  nomorMI: string;
  noProvisioning: string;
  notaAktivasi: string;
  statusId: number;
  anId: number;
  ipKit?: string;
  snStarlinkKit: string;
  serviceline: string;
  orderNumber: string;
  psbTeknisId: number;
  active: boolean;
  currentKitSerialNumber: string;
  startDate: Date;
  uptime: number;
  lastUpdated: Date;
};

// zod schema transform date
const schema = z.object({
  id: z.number(),
  trieasyId: z.number(),
  fullName: z.string(),
  endCustomerName: z.string(),
  nodes: z.object({
    up: z.number(),
    down: z.number(),
    count: z.number(),
    inactive: z.number(),
    data: z.array(
      z.object({
        mNodelinkId: z.number(),
        mCustomerId: z.number(),
        namaCustomer: z.string().nullable(),
        sid: z.string().nullable(),
        starlinkSid: z.string().nullable(),
        namaNodelink: z.string().nullable(),
        layanan: z.string().nullable(),
        nomorMI: z.string().nullable(),
        noProvisioning: z.string().nullable(),
        notaAktivasi: z.string().nullable(),
        statusId: z.number().nullable(),
        anId: z.number().nullable(),
        ipKit: z.string().nullable(),
        snStarlinkKit: z.string().nullable(),
        serviceline: z.string().nullable(),
        orderNumber: z.string().nullable(),
        psbTeknisId: z.number().nullable(),
        active: z.boolean().nullable(),
        currentKitSerialNumber: z.string().nullable(),
        starDate: z.coerce.date(),
        uptime: z.number().nullable(),
        lastUpdated: z.coerce.date(),
      })
    ),
  }),
});

export type CustomerParams = {
  uuid: string;
};

export const getCustomer = async (params: CustomerParams) => {
  // add delay 2  second
  await new Promise(resolve => setTimeout(resolve, 2000));
  const { uuid } = params;
  const { data } = await ax.get<CustomerResponse>(`/customer/${uuid}`);
  return schema.parse(data.data);
};

export const getCustomerCSV = async (uuid: string) => {
  // convert date to epoch
  const response = await ax.get(`/customer/${uuid}?format=csv`, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(response.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = `customer.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};
