import { Request, Response, NextFunction } from 'express';
import { JwtPayload, verifyToken } from '@/utils/jwt';
import { ApiError } from '@/utils/ApiError';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const requireAuth = async (
  req: AuthRequest,
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
