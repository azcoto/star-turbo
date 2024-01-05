import { Router } from 'express';
import getNodes from './get-nodes';
import { authGuard } from '@/middlewares/baktiGuard';

const router = Router();
router.get('/', authGuard, (req, res) => {
  return res.status(200).json({ status: true, message: 'Bakti API' });
});
router.use('/nodes', authGuard, getNodes);

export default router;
