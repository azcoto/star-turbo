import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './errorHandler';
import env from './config';
import logger from './logger';
import 'dotenv/config';

const { nodeEnv } = env;
const app = express();

app.use(
  cors({
    origin: ['http://localhost', 'http://localhost:8900', 'http://127.0.0.1:8900', 'http://10.45.253.245:8900'],
  })
);

// app.use(logger);
app.use(bodyParser.json());
app.use(routes);
app.use(errorHandler);

if (nodeEnv === 'production')
  app.listen(8000, () => {
    console.log('Server listening on port 8000');
  });
export const viteNodeApp = app;
