import { Router } from 'express';
import { validate } from './validate';
import handler from './handler';
import { authGuard } from '@/middlewares/authGuard';

const router = Router();

router.get('/:uuid', validate, handler);

export default router;
