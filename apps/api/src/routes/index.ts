import { Router } from 'express';
import telemetryRoutes from '@/endpoints/telemetry';
import authenticationRoutes from '@/endpoints/authentication';
import serviceLineRoutes from '@/endpoints/service-line';
import customerRoutes from '@/endpoints/customer';
import rootRoutes from '@/endpoints/root';

const router = Router();

router.use('/', rootRoutes);
router.use('/auth', authenticationRoutes);
router.use('/telemetry', telemetryRoutes);
router.use('/service-line', serviceLineRoutes);
router.use('/customer', customerRoutes);

export default router;
