import { responseHandler } from '@/middleware';
import { getAll } from '@/services/spot.service';
import { Router } from 'express';

const router = Router();
router.get('/futbolines', responseHandler(getAll));

export default router;
