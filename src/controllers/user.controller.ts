import { getFullUser } from "@/services/user.service";
import { ApiResponse, ok } from "@/utils/ApiResponse";
import { GetFullUserQuery } from "futbol-in-core/schemas";

export const getFullUserController = async (
  req: { validatedQuery: GetFullUserQuery }
): Promise<ApiResponse<Awaited<ReturnType<typeof getFullUser>>>> => {
  const { userId } = req.validatedQuery;
  const data = await getFullUser(userId);
  return ok(data, "Usuario completo");
};
