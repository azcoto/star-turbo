import { Router } from 'express';
import telemetryRoutes from '../telemetry';
import authenticationRoutes from '../authentication';

import rootRoutes from '../root';

const router = Router();

router.use('/', rootRoutes);
router.use('/auth', authenticationRoutes);
router.use('/telemetry', telemetryRoutes);
export default router;
