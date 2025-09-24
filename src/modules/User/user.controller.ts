import { ApiResponse, ok } from "@/utils/ApiResponse";
import { GetFullUserQuery } from "futbol-in-core/schemas";
import { UserService } from './user.service';

const getFullUserController = async (
  req: { validatedQuery: GetFullUserQuery }
): Promise<ApiResponse<Awaited<ReturnType<typeof UserService.getFullUser>>>> => {
  const { userId } = req.validatedQuery;
  console.log(userId);
  const data = await UserService.getFullUser(userId);
  return ok(data, "Usuario completo");
};

export const UserController = {
  getFullUserController
};