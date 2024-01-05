import { Router } from 'express';
import nodesRoute from './node';
import telemetryRoute from './telemetry';

const router = Router();

router.use(nodesRoute);
router.use(telemetryRoute);

export default router;
