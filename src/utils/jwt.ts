import { SignJWT, jwtVerify, JWTPayload } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);
const EXP_SECONDS = 60 * 60 * 24 * 30;

export interface MobileJwtPayload extends JWTPayload {
  id: string;
  email: string;
  name: string;
  role: string[];
  status: string;
  provider: string;
  imagen: string;
}

export const signToken = async (payload: MobileJwtPayload) =>
  new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXP_SECONDS)
    .sign(secretKey);

export const verifyToken = async (token: string) =>
  jwtVerify<MobileJwtPayload>(token, secretKey);
