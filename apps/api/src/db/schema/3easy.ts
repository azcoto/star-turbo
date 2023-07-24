import { mysqlTable, datetime, boolean, int, bigint, varchar } from 'drizzle-orm/mysql-core';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import config from '@/config';
import { relations } from 'drizzle-orm';

const { fulfillmentConnStr } = config;
const queryClient = mysql.createPool({
  uri: fulfillmentConnStr,
});

export const dbFulfillment = drizzle(queryClient);

export const vMasterNodelinkStarlink = mysqlTable('v_master_nodelink_starlink', {
  mNodelinkId: int('m_nodelink_id').notNull(),
  mCustomerId: int('m_customer_id').notNull(),
  namaCustomer: varchar('nama_customer', { length: 100 }),
  sid: varchar('sid', { length: 255 }),
  starlinkSid: varchar('starlink_sid', { length: 7 }),
  namaNodelink: varchar('nama_nodelink', { length: 255 }),
  layanan: varchar('layanan', { length: 255 }),
  nomorMI: varchar('nomor_mi', { length: 255 }),
  noProvisioning: varchar('no_provisioning', { length: 255 }),
  notaAktivasi: varchar('nota_aktivasi', { length: 255 }),
  statusId: int('status_id'),
  anId: int('an_id'),
  snStarlinkKit: varchar('sn_starlink_kit', { length: 100 }),
  ipKit: varchar('ip_kit', { length: 255 }),
  serviceline: varchar('serviceline', { length: 100 }),
  orderNumber: varchar('order_number', { length: 255 }),
  psbTeknisId: int('psb_teknis_id'),
});
