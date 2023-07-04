import express from 'express';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:8900',
  })
);

app.get('/', (req, res) =>
  res.json({
    sucess: true,
    message: 'Hello World',
  })
);

if (import.meta.env.PROD) app.listen(8000);

export const viteNodeApp = app;
