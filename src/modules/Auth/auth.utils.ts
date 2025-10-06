import { JwtPayload } from "@/utils/jwt";
import { UserRole, UserStatus } from "futbol-in-core/enum";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}
export function gen6Code(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function buildJwt (user:any, statusOverride?:UserStatus) {
  const payload: JwtPayload = {
    id: String(user._id),
    email: user.email ?? "",
    name: user.name ?? "",
    role: (user.role || [UserRole.USER]).map(String),
    status: (statusOverride ?? user.status) as UserStatus,
    provider: user.provider ?? "",
    imagen: user.imagen ?? "",
  };
  return payload;
};