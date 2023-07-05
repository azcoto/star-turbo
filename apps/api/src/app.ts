import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './errorHandler';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:8900',
  })
);

app.use(routes);
app.use(errorHandler);

if (import.meta.env.PROD) app.listen(8000);

export const viteNodeApp = app;
