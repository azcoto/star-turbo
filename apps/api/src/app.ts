import express from 'express';
import cors from 'cors';
import postgres from 'postgres';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { serviceLine } from './db/schema/service-line';

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
  const result = await db.select().from(serviceLine);
  return res.json({
    sucess: true,
    message: 'Success!',
    count: result.length,
    data: result,
  });
});

if (import.meta.env.PROD) app.listen(8000);

export const viteNodeApp = app;
