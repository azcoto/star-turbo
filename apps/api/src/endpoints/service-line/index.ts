import { Router } from 'express';
import { authGuard } from '@/middlewares/authGuard';
import getServiceLine from './get-service-line';
import getUptime from './get-uptime';

const router = Router();

router.use(authGuard, getServiceLine);
router.use(authGuard, getUptime);

export default router;
