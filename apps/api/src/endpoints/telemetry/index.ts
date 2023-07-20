import { Router } from 'express';

import getTelemetry from './get-telemetry';
import getRawData from './get-month-raw';

const router = Router();

router.use(getTelemetry);
router.use(getRawData);
export default router;
