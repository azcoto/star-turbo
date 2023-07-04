import { pgTable, boolean, varchar, doublePrecision, timestamp } from 'drizzle-orm/pg-core';

export const serviceLine = pgTable('service_line', {
  serviceLineNumber: varchar('service_line_number', { length: 30 }).primaryKey(),
  addressReferenceId: varchar('address_reference_id', { length: 50 }),
  nickname: varchar('nickname', { length: 255 }),
  active: boolean('active'),
});

export const addressLine = pgTable('address_line', {
  addressReferenceId: varchar('address_reference_id', { length: 50 }).primaryKey(),
  addressLines: varchar('address_lines', { length: 255 }).notNull(),
  locality: varchar('locality', { length: 255 }).notNull(),
  administrativeArea: varchar('administrative_area', { length: 255 }),
  administrativeAreaCode: varchar('administrative_area_code', { length: 255 }),
  region: varchar('region', { length: 255 }),
  regionCode: varchar('region_code', { length: 255 }),
  postalCode: varchar('postal_code', { length: 255 }),
  metadata: varchar('metadata', { length: 255 }),
  formattedAddress: varchar('formatted_address', { length: 255 }),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
});

export const subscriptions = pgTable('subscriptions', {
  subscriptionsReferenceId: varchar('subscriptions_reference_id', { length: 50 }).primaryKey(),
  serviceLineNumber: varchar('service_line_number', { length: 30 }),
  descr: varchar('descr', { length: 255 }).notNull(),
  startDate: timestamp('start_date', { withTimezone: true }),
  normalizedStartDate: timestamp('normalized_start_date', { withTimezone: true }),
  endDate: timestamp('end_date', { withTimezone: true }),
  serviceEndDate: timestamp('service_end_date', { withTimezone: true }),
  delayedProductId: varchar('delayed_product_id', { length: 255 }),
  optInProductId: varchar('opt_in_product_id', { length: 255 }),
});

export const terminals = pgTable('terminals', {
  userTerminalId: varchar('user_terminal_id', { length: 30 }).primaryKey(),
  kitSerialNumber: varchar('kit_serial_number', { length: 20 }).notNull(),
  dishSerialNumber: varchar('dish_serial_number', { length: 20 }),
  serviceLineNumber: varchar('service_line_number', { length: 30 }),
  active: boolean('active').notNull(),
});
