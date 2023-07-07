import { Response, Request } from 'express';

const handler = async (_req: Request, res: Response) => {
  return res.status(200).json({ message: 'Starlink Dashboard API ' });
};

export default handler;
