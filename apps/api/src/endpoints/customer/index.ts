import { Router } from 'express';
import getCustomerRoute from './get-customer';

const router = Router();

router.use(getCustomerRoute);

export default router;
