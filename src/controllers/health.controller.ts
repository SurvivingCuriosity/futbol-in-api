import { ok } from '@/utils/ApiResponse';
import os from 'os';

export const health = async () =>
  ok({
    uptime: process.uptime(),
    hostname: os.hostname(),
    env: process.env.NODE_ENV,
    ts: new Date().toISOString(),
  });
