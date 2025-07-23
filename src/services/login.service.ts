import { findByEmail } from "@/repositories/user.repository";
import { ApiError } from "@/utils/ApiError";
import { MobileJwtPayload, signToken } from "@/utils/jwt";
import * as bcrypt from "bcrypt";
import { UserRole, UserStatus } from "futbol-in-core/enum";
import { LoginBody } from "futbol-in-core/schemas";

export const login = async ({ email, password }: LoginBody) => {
  console.log("Login service: ", { email, password });

  const user = await findByEmail(email);

  const valid = user && (await bcrypt.compare(password, user.password ?? ""));

  if (!valid) {
    throw new ApiError(401, "Credenciales inválidas");
  }

  const payload: MobileJwtPayload = {
    id: String(user._id),
    email: user.email ?? "",
    name: user.name ?? "",
    role: (user.role || [UserRole.USER]).map(String),
    status: user.status as UserStatus,
    provider: user.provider ?? "",
    imagen: user.imagen ?? "",
  };

  const token = await signToken(payload);

  return { token, user: payload };
};
