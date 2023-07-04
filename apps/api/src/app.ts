import express from 'express';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.get('/', (req, res) =>
  res.json({
    sucess: true,
    message: 'Hello World',
  })
);

app.listen(8800);

import { Application } from 'express';
export const viteNodeApp: Application = app;
