import { Router } from 'express';
import getServiceLine from './get-service-line';

const router = Router();

router.use(getServiceLine);

export default router;
