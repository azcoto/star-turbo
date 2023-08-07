import { Router } from 'express';
import getCustomerRoute from './get-customer';
import { authGuard } from '@/middlewares/authGuard';

const router = Router();

router.use(authGuard, getCustomerRoute);

export default router;
