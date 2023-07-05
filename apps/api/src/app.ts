import express from 'express';
import cors from 'cors';
import postgres from 'postgres';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { addressLine, serviceLine, subscriptions, telemetry, terminals } from './db/schema/service-line';
import { desc, sql } from 'drizzle-orm';

const app = express();
console.log(import.meta.env.VITE_DB_URL);
const queryClient = postgres(import.meta.env.VITE_DB_URL);
const db: PostgresJsDatabase = drizzle(queryClient);

app.use(
  cors({
    origin: 'http://localhost:8900',
  })
);

app.get('/', async (req, res) => {
  const query = db
    .select({
      ts: sql<string>`time_bucket('5 minutes', ts)`.as('ts'),
    })
    .from(telemetry)
    .orderBy(desc(telemetry.ts))
    .limit(10000);
  const result = await query;
  return res.json({
    sucess: true,
    message: 'Success!',
    count: result.length,
    data: result,
  });
});

if (import.meta.env.PROD) app.listen(8000);

export const viteNodeApp = app;
