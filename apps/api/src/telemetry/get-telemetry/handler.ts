import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { desc, sql } from 'drizzle-orm';
import { telemetry } from '../../db/schema/service-line';
import { TelemetryRequest, TelemetryResponse } from './dtos';
import { NextFunction } from 'express';

const queryClient = postgres(import.meta.env.VITE_DB_URL);
const db: PostgresJsDatabase = drizzle(queryClient);

export const handler = async (_req: TelemetryRequest, res: TelemetryResponse) => {
  const query = db
    .select({
      ts: sql<string>`time_bucket('5 minutes', ts)`.as('ts'),
    })
    .from(telemetry)
    .orderBy(desc(telemetry.ts))
    .limit(10000);
  const result = await query;
  return res.json({
    success: true,
    message: 'Success!',
    count: result.length,
    data: result,
  });
};
