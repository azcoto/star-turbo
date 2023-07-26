import { Router } from 'express';
import { validate } from './validate';
import handler from './handler';

const router = Router();

router.get('/:uuid', validate, handler);

export default router;
