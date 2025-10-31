import { ApiError } from '@/utils/ApiError';
import { verifyToken } from '@/utils/jwt';
import { NextFunction, Request, Response } from 'express';

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) throw new ApiError(401, 'No autorizado');

  try {
    const { payload } = await verifyToken(token);
    req.user = payload;
    next();
  } catch {
    throw new ApiError(401, 'Token inválido o expirado');
  }
};
