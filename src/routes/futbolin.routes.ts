import { responseHandler } from '@/middleware';
import { getAll } from '@/services/futbolin.service';
import { Router } from 'express';

const router = Router();
router.get('/futbolines', responseHandler(getAll));

export default router;
