import { Router } from 'express';

import getTelemetry from './get-telemetry';

const router = Router();

router.use(getTelemetry);
export default router;
