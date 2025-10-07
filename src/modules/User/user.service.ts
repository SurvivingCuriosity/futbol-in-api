import { EstadoJugador, UserRole, UserStatus } from "futbol-in-core/enum";
import { FutbolinService } from "./../Futbolines/futbolin.service";

import { getSignedReadUrl } from "@/infra/gcp_storage.service";
import { EquipoRepository } from "@/modules/Equipos/equipo.repository";
import { UserRepository } from "@/modules/User/user.repository";
import { ApiError } from "@/utils/ApiError";
import { EditarUserBody } from "futbol-in-core/schemas";
import { SpotDTO, UserDTO } from "futbol-in-core/types";
import { IUserDocument, User } from "./user.model";

const findById = async (userId: string) => {
  const user = await UserRepository.findById(userId); // 👈 await

  if (!user) throw new ApiError(404, "Usuario no encontrado");

  return mapToDTO(user);
};

const getFullUser = async (userId: string) => {
  // 1. Usuario
  console.log(" en servicio userId: ", userId);
  const fullUser = await UserRepository.findById(userId);
  console.log("en servicio fullUser: ", fullUser);
  if (!fullUser) throw new ApiError(404, "Usuario no encontrado");

  // 2. Equipos ACEPTADOS
  const equipos = await EquipoRepository.findManyById(fullUser.equipos);
  const equiposAceptados = equipos.filter((equipo) => {
    const jugador = equipo.jugadores.find(
      (j) => j.usuario === String(fullUser._id)
    );
    return jugador?.estado === EstadoJugador.ACEPTADO;
  });

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
    equipos: equiposAceptados,
    imagen: imageUrl,
    futbolines,
  };
};

const getAllUsers = async (): Promise<UserDTO[]> => {
  const users = await UserRepository.findAll();
  return users.map(mapToDTO);
};

const editarPerfil = async (userId: string, input: EditarUserBody) => {
  const updated = await UserRepository.updateEditableById(userId, input);
  if (!updated) throw new ApiError(404, "Usuario no encontrado");
  return mapToDTO(updated);
};

export const mapToDTO = (user: IUserDocument): UserDTO => {
  return {
    id: user._id.toString(),
    idOperador: user.idOperador?.toString() || null,
    name: user.name || "",
    email: user.email,
    imagen: user.imagen,
    status: user.status || UserStatus.MUST_CONFIRM_EMAIL,
    role: user.role || [UserRole.USER],
    provider: user.provider,
    createdAt: user.createdAt,
    stats: {
      lugaresAgregados: user.stats.addedFutbolines,
      lugaresRevisados: user.stats.votedFutbolines,
      lugaresVerificados: user.stats.verifiedFutbolines,
    },
    equipos: user.equipos?.map((e) => e.toString()),
    nombre: user.nombre,
    telefono: user.telefono,
    posicion: user.posicion,
    ciudad: user.ciudad,
    ciudadActual: user.ciudadActual,
  };
};

export const UserService = {
  getFullUser,
  getAllUsers,
  findById,
  editarPerfil,
};
