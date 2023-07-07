import { Router } from 'express';
import telemetryRoutes from '../telemetry';
import rootRoutes from '../root';

const router = Router();

router.use('/', rootRoutes);
router.use('/telemetry', telemetryRoutes);
export default router;
