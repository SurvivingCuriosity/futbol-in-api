import { login } from "@/services/login.service";
import { ok } from "@/utils/ApiResponse";
import { ApiResponse } from "@/utils/ApiResponse";
import { LoginBody } from "futbol-in-core/schemas";

export const loginController = async (req: {
  validated: LoginBody;
}): Promise<ApiResponse<{ token: string; user: unknown }>> => {
  const { token, user } = await login(req.validated);
  return ok({ token, user }, "Login correcto");
};
