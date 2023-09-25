import { Router } from 'express';
import { authGuard } from '@/middlewares/authGuard';

import getTelemetry from './get-telemetry';
import getRawData from './get-month-raw';

const router = Router();

router.use(authGuard, getTelemetry);
router.use(authGuard, getRawData);
export default router;
