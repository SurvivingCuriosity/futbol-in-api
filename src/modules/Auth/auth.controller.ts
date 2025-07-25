import { AuthService } from "@/modules/Auth/auth.service";
import { ok } from "@/utils/ApiResponse";
import { ApiResponse } from "@/utils/ApiResponse";
import { LoginBody } from "futbol-in-core/schemas";

export const login = async (req: {
  validated: LoginBody;
}): Promise<ApiResponse<{ token: string; user: unknown }>> => {
  const { token, user } = await AuthService.login(req.validated);
  return ok({ token, user }, "Login correcto");
};

export const AuthController = {
  login,
};
