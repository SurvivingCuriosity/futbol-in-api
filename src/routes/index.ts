import { Router } from 'express';
import healthRouter from './health.routes';
import futbolinRouter from './futbolin.routes';

const router = Router();

router.use('/', healthRouter);
router.use('/', futbolinRouter);     

export default router;
