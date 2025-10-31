import { AuthProvider, UserRole, UserStatus } from "futbol-in-core/enum";
import { FutbolinService } from "./../Futbolines/futbolin.service";

import { bucket, getSignedReadUrl } from "@/infra/gcp_storage.service";
import { UserRepository } from "@/modules/User/user.repository";
import { ApiError } from "@/utils/ApiError";
import * as bcrypt from "bcrypt";
import { EditarUserBody } from "futbol-in-core/schemas";
import { SpotDTO, UserDTO } from "futbol-in-core/types";
import { UserDoc } from "./user.model";
import { gen6Code } from "../Auth/auth.utils";
import { sendVerifyEmail } from "@/infra/mailservice";
import { v4 as uuidv4 } from "uuid";

const findById = async (userId: string) => {
  const user = await UserRepository.findById(userId); // 👈 await

  if (!user) throw new ApiError(404, "Usuario no encontrado");

  return mapToDTO(user);
};

const getFullUser = async (userId: string) => {
  // 1. Usuario
  const fullUser = await UserRepository.findById(userId);
  if (!fullUser) throw new ApiError(404, "Usuario no encontrado");

  // 2. Equipos ACEPTADOS

  // 3. Futbolines del usuario
  const futbolines: SpotDTO[] = await FutbolinService.getSpotsDeUsuario(
    String(fullUser._id)
  );

  // 4. URL firmada (si hay imagen)
  let imageUrl: string | null = null;
  if (fullUser.imagen) {
    try {
      imageUrl = await getSignedReadUrl(fullUser.imagen);
    } catch (err) {
      // loggear pero no romper la respuesta
      console.error("Error firmando URL GCS:", err);
    }
  }

  return {
    user: mapToDTO(fullUser),
    imagen: imageUrl,
    futbolines,
  };
};

const getFullUserByUsername = async (username: string) => {
  // 1. Usuario
  const fullUser = await UserRepository.findByUsername(username);
  if (!fullUser) throw new ApiError(404, "Usuario no encontrado");

  // 3. Futbolines del usuario
  const futbolines: SpotDTO[] = await FutbolinService.getSpotsDeUsuario(
    String(fullUser._id)
  );

  // 4. URL firmada (si hay imagen)
  let imageUrl: string | null = null;
  if (fullUser.imagen) {
    try {
      imageUrl = await getSignedReadUrl(fullUser.imagen);
    } catch (err) {
      // loggear pero no romper la respuesta
      console.error("Error firmando URL GCS:", err);
    }
  }

  return {
    user: mapToDTO(fullUser),
    imagen: imageUrl,
    futbolines,
  };
};

const getAllUsers = async (): Promise<UserDTO[]> => {
  const users = await UserRepository.findAll();
  return users.map(mapToDTO);
};

const editarPerfil = async (userId: string, input: EditarUserBody) => {
  // 🔹 Si quiere cambiar el `name`, comprobamos que no esté en uso
  if (input.name) {
    const existente = await UserRepository.findByUsername(input.name.trim());
    if (existente && existente._id.toString() !== userId) {
      throw new ApiError(409, "Ese nombre de usuario ya está en uso");
    }
  }

  const updated = await UserRepository.updateEditableById(userId, input);
  if (!updated) throw new ApiError(404, "Usuario no encontrado");

  return mapToDTO(updated);
};

const cambiarPassword = async (
  userId: string,
  currentPassword: string,
  nuevaPassword: string,
  confirmNuevaPassword: string
) => {
  if (nuevaPassword !== confirmNuevaPassword)
    throw new ApiError(400, "Las contraseñas no coinciden");

  const user = await UserRepository.findById(userId);
  if (!user) throw new ApiError(404, "Usuario no encontrado");
  if (user.provider === AuthProvider.GOOGLE)
    throw new ApiError(
      400,
      "No puedes cambiar la contraseña de un usuario registrado con Google"
    );

  const match = await bcrypt.compare(currentPassword, user.password || "");
  if (!match) throw new ApiError(401, "La contraseña actual es incorrecta");

  const hashed = await bcrypt.hash(nuevaPassword, 10);
  user.password = hashed;
  await user.save();

  return { success: true };
};

const cambiarEmail = async (
  userId: string,
  currentEmail: string,
  nuevoEmail: string,
  confirmNuevoEmail: string,
  currentPassword: string
) => {
  if (nuevoEmail !== confirmNuevoEmail)
    throw new ApiError(400, "Los emails no coinciden");

  const user = await UserRepository.findById(userId);
  if (!user) throw new ApiError(404, "Usuario no encontrado");

  if (user.provider === AuthProvider.GOOGLE)
    throw new ApiError(
      400,
      "No puedes cambiar el correo de un usuario registrado con Google"
    );

  if (user.email !== currentEmail)
    throw new ApiError(400, "El email actual no coincide");

  const match = await bcrypt.compare(currentPassword, user.password || "");
  if (!match) throw new ApiError(401, "La contraseña actual es incorrecta");

  // 🔍 Verificar que el nuevo email no esté en uso
  const existente = await UserRepository.findByEmail(nuevoEmail);
  if (existente && existente._id.toString() !== userId)
    throw new ApiError(409, "Ese correo ya está en uso");

  // 🧩 Generar código y enviar correo
  const code = gen6Code();
  await sendVerifyEmail(nuevoEmail, code);

  const updated = await UserRepository.updateEmail(userId, nuevoEmail, code);
  if (!updated) throw new ApiError(404, "Usuario no encontrado");

  return mapToDTO(updated);
};

type CambiarImagenParams = {
  userId: string;
  action: "upload" | "replace" | "delete";
  currentImage?: string;
  file?: Express.Multer.File;
};

const cambiarImagen = async ({
  userId,
  action,
  currentImage,
  file,
}: CambiarImagenParams) => {
  // 1️⃣ Validar usuario
  const user = await UserRepository.findById(userId);
  if (!user) throw new ApiError(404, "Usuario no encontrado");

  // 2️⃣ Eliminar imagen anterior si existe
  if (currentImage) {
    try {
      await bucket.file(currentImage).delete({ ignoreNotFound: true });
    } catch (err) {
      console.error("Error al eliminar imagen anterior:", err);
    }
  }

  // 3️⃣ Si la acción es "delete" → solo borrar de BD
  if (action === "delete") {
    await UserRepository.updateImage(userId, null);
    return { success: true, path: null, url: null };
  }

  // 4️⃣ Validar archivo
  if (!file || !file.buffer) {
    throw new ApiError(400, "No se recibió archivo para subir");
  }

  // 5️⃣ Generar nombre único y subir al bucket
  const extension = file.originalname.split(".").pop() || "jpg";
  const objectPath = `users/${userId}/${uuidv4()}.${extension}`;
  const blob = bucket.file(objectPath);

  await blob.save(file.buffer, {
    contentType: file.mimetype,
    resumable: false,
    public: false,
  });

  // 6️⃣ Actualizar en BD
  await UserRepository.updateImage(userId, objectPath);

  // 7️⃣ Obtener signed URL
  const signedUrl = await getSignedReadUrl(objectPath);

  return { success: true, path: objectPath, url: signedUrl };
};

// TODO actualizar UserDTO
export const mapToDTO = (user: UserDoc): UserDTO => {
  return {
    id: user._id.toString(),
    name: user.name || "",
    email: user.email,
    nombre: user.nombre,
    imagen: user.imagen,
    status: user.status,
    role: user.role as UserRole[],
    provider: user.provider,
    posicion: user.posicion,
    ciudad: user.ciudad,
    createdAt: user.createdAt,
  };
};

export const UserService = {
  getFullUser,
  getAllUsers,
  findById,
  editarPerfil,
  getFullUserByUsername,
  cambiarPassword,
  cambiarEmail,
  cambiarImagen
};
