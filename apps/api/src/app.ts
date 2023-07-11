import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './errorHandler';
import logger from './logger';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:8900', 'http://127.0.0.1:8900'],
  })
);

// app.use(logger);
app.use(bodyParser.json());
app.use(routes);
app.use(errorHandler);

if (import.meta.env.PROD) app.listen(8000);

export const viteNodeApp = app;
