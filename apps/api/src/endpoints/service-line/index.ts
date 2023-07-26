import { Router } from 'express';
import getServiceLine from './get-service-line';
import getUptime from './get-uptime';

const router = Router();

router.use(getServiceLine);
router.use(getUptime);

export default router;
