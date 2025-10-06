import { ApiResponse, ok } from "@/utils/ApiResponse";
import { editarUserBodySchema, GetFullUserQuery } from "futbol-in-core/schemas";
import { UserService } from "./user.service";
import { ApiError } from "@/utils/ApiError";

const getFullUserController = async (req: {
  validatedQuery: GetFullUserQuery;
}): Promise<
  ApiResponse<Awaited<ReturnType<typeof UserService.getFullUser>>>
> => {
  const { userId } = req.validatedQuery;
  const data = await UserService.getFullUser(userId);
  return ok(data, "Usuario completo");
};

const editarUserController = async (req: Request) => {
  // `requireAuth` debe haber puesto req.user.id
  const userId = (req as any).user?.id as string;
  if (!userId) throw new ApiError(403, "No tienes permisos para editar");

  const input = editarUserBodySchema.parse(req.body);
  const updated = await UserService.editarPerfil(userId, input);

  return ok(updated, "Perfil actualizado");
};

export const UserController = {
  getFullUserController,
  editarUserController,
};
