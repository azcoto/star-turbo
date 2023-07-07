import { mysqlTable, datetime, boolean, int, bigint, varchar } from 'drizzle-orm/mysql-core';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import config from '@/config';

const { starspaceConnStr } = config;

const queryClient = mysql.createPool({
  uri: starspaceConnStr,
});

export const starspaceDb = drizzle(queryClient);

export const user = mysqlTable('users', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  endCustomerId: bigint('end_customer_id', { mode: 'number' }),
  uuid: varchar('uuid', { length: 36 }),
  fullName: varchar('full_name', { length: 191 }),
  username: varchar('username', { length: 191 }),
  email: varchar('email', { length: 255 }),
  password: varchar('password', { length: 191 }).notNull(),
  name: varchar('name', { length: 191 }),
  address: varchar('address', { length: 191 }),
  city: varchar('city', { length: 191 }),
  phone: varchar('phone', { length: 191 }),
  avatarUrl: varchar('avatar_url', { length: 255 }),
  loginLimit: int('login_limit'),
  isActive: boolean('is_active'),
  createdAt: datetime('created_at'),
  updatedAt: datetime('updated_at'),
});