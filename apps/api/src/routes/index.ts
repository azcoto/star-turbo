import { Router } from 'express';
import telemetryRoutes from '@/endpoints/telemetry';
import authenticationRoutes from '@/endpoints/authentication';
import serviceLineRoutes from '@/endpoints/service-line';

import rootRoutes from '@/endpoints/root';

const router = Router();

router.use('/', rootRoutes);
router.use('/auth', authenticationRoutes);
router.use('/telemetry', telemetryRoutes);
router.use('/service-line', serviceLineRoutes);

export default router;
