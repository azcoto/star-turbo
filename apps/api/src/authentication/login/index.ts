import { Router } from 'express';
import { validate } from './validate';
import handler from './handler';

const router = Router();

router.post('/', validate, handler);

export default router;
