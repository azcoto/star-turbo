import { Router } from 'express';
import telemetryRoutes from '../telemetry';

const router = Router();

router.use('/telemetry', telemetryRoutes);
export default router;
