import { Router } from 'express';
import telemetryRoutes from '@/endpoints/telemetry';
import authenticationRoutes from '@/endpoints/authentication';

import rootRoutes from '@/endpoints/root';

const router = Router();

router.use('/', rootRoutes);
router.use('/auth', authenticationRoutes);
router.use('/telemetry', telemetryRoutes);
export default router;
