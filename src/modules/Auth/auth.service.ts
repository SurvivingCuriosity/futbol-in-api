import { UserRepository } from "@/modules/User/user.repository";
import { ApiError } from "@/utils/ApiError";
import { JwtPayload, signToken } from "@/utils/jwt";
import * as bcrypt from "bcrypt";
import { UserRole, UserStatus } from "futbol-in-core/enum";
import { LoginBody } from "futbol-in-core/schemas";

const login = async ({ email, password }: LoginBody) => {
  const user = await UserRepository.findByEmail(email);

  const valid = user && (await bcrypt.compare(password, user.password ?? ""));

  if (!valid) {
    throw new ApiError(401, "Credenciales inválidas");
  }

  const payload: JwtPayload = {
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

export const AuthService = {
  login,
}