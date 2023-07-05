import express from 'express';
import cors from 'cors';
import postgres from 'postgres';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { addressLine, serviceLine, subscriptions, telemetry, terminals } from './db/schema/service-line';
import { desc } from 'drizzle-orm';

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
  const result = await db.select().from(telemetry).orderBy(desc(telemetry.ts)).limit(100);
  return res.json({
    sucess: true,
    message: 'Success!',
    count: result.length,
    data: result,
  });
});

export const viteNodeApp = app;
