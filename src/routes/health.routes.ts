import { health } from '@/controllers/health.controller';
import { responseHandler } from '@/middleware';
import { Router } from 'express';

const router = Router();
router.get('/health', responseHandler(health));
export default router;
