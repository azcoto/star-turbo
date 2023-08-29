import { Router } from 'express';
import loginRoute from './login';
import changePasswordRoute from './change-password';

const router = Router();

router.use(loginRoute);
router.use(changePasswordRoute);

export default router;
