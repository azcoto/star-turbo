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
  snStarlinkKit: string;
  serviceline: string;
  orderNumber: string;
  psbTeknisId: number;
  currentKitSerialNumber: string;
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
        snStarlinkKit: z.string().nullable(),
        serviceline: z.string().nullable(),
        orderNumber: z.string().nullable(),
        psbTeknisId: z.number().nullable(),
        currentKitSerialNumber: z.string().nullable(),
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
  const { uuid } = params;
  const { data } = await ax.get<CustomerResponse>(`/customer/${uuid}`);
  return schema.parse(data.data);
};
