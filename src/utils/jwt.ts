import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const RAW_SECRET = process.env.JWT_SECRET;
if (!RAW_SECRET) throw new Error('Falta JWT_SECRET');
export const secretKey = new TextEncoder().encode(RAW_SECRET); // HS256 key
const ACCESS_EXPIRES = '30d';                                   // ISO 8601

export interface JwtPayload extends JWTPayload {
  id: string;
  email: string;
  name: string;
  role: string[];
  status: string;
  provider: string;
  imagen: string;
}

export const signToken = (payload: JwtPayload) =>
  new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_EXPIRES)
    .sign(secretKey);

export const verifyToken = async (token: string) =>
  jwtVerify<JwtPayload>(token, secretKey);
