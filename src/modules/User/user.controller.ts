import { ApiError } from "@/utils/ApiError";
import { ok } from "@/utils/ApiResponse";
import { ValidatedRequest } from "@/utils/types";
import {
  CambiarEmailBody,
  CambiarPasswordBody,
  EditarUserBody,
  GetFullUserQuery,
  UserImageRequestBody,
} from "futbol-in-core/schemas";
import { isValidObjectId } from "mongoose";
import { UserService } from "./user.service";

export const UserController = {
  getFullUserController: async (
    req: ValidatedRequest<any, any, GetFullUserQuery>
  ) => {
    const { userId } = req.validatedQuery;

    if (!isValidObjectId(userId))
      throw new ApiError(400, "Usuario no existente");

    const data = await UserService.getFullUser(userId);
    return ok(data, "Usuario completo");
  },

  getFullUserByUsernameController: async (
    req: ValidatedRequest<any, any, GetFullUserQuery>
  ) => {
    const { username } = req.validatedQuery;

    const data = await UserService.getFullUserByUsername(username);
    return ok(data, "Usuario completo");
  },

  editarUserController: async (req: ValidatedRequest<any, EditarUserBody>) => {
    const userId = req.user!.id;
    if (!userId) throw new ApiError(403, "No tienes permisos para editar");

    const data = req.validated;
    const updated = await UserService.editarPerfil(userId, data);

    return ok(updated, "Perfil actualizado");
  },

  cambiarPassword: async (req: ValidatedRequest<any, CambiarPasswordBody>) => {
    const userId = req.user!.id;
    if (!userId) throw new ApiError(403, "No tienes permisos para editar");

    const { currentPassword, nuevaPassword, confirmNuevaPassword } =
      req.validated;

    const result = await UserService.cambiarPassword(
      userId,
      currentPassword,
      nuevaPassword,
      confirmNuevaPassword
    );

    return ok(result, "Contraseña actualizada correctamente");
  },

  cambiarEmail: async (req: ValidatedRequest<any, CambiarEmailBody>) => {
    const userId = req.user!.id;
    if (!userId) throw new ApiError(403, "No tienes permisos para editar");

    const { currentEmail, nuevoEmail, confirmNuevoEmail, currentPassword } =
      req.validated;

    const result = await UserService.cambiarEmail(
      userId,
      currentEmail,
      nuevoEmail,
      confirmNuevoEmail,
      currentPassword
    );

    return ok(
      result,
      "Email actualizado correctamente. Revisa tu bandeja para confirmar el nuevo correo."
    );
  },

  cambiarImagen: async (
    req: ValidatedRequest<any, UserImageRequestBody> & { file: Express.Multer.File }
  ) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(403, "No autorizado");

    const { action, currentImage } = req.validated;
    const file = req.file; // si usas multer o busboy para manejar form-data

    const result = await UserService.cambiarImagen({
      userId,
      action,
      currentImage,
      file,
    });

    return ok(result, "Imagen de perfil actualizada correctamente");
  },
};
