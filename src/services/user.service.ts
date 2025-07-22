import { EstadoJugador, UserRole, UserStatus } from "futbol-in-core/enum";

import { IUserDocument, User } from "@/models/user.model";
import { findManyById } from "@/repositories/equipo.repository";
import { ApiError } from "@/utils/ApiError";
import { SpotDTO, UserDTO } from "futbol-in-core/types";
import { getSpotsDeUsuario } from "./futbolin.service";
import { getSignedReadUrl } from "./gcp_storage.service";

export const getFullUser = async (userId: string) => {
  // 1. Usuario
  const fullUser = await User.findById(userId);
  if (!fullUser) throw new ApiError(404, "Usuario no encontrado");

  // 2. Equipos ACEPTADOS
  const equipos = await findManyById(fullUser.equipos);
  const equiposAceptados = equipos.filter((equipo) => {
    const jugador = equipo.jugadores.find(
      (j) => j.usuario === String(fullUser._id)
    );
    return jugador?.estado === EstadoJugador.ACEPTADO;
  });

  // 3. Futbolines del usuario
  const futbolines: SpotDTO[] = await getSpotsDeUsuario(String(fullUser._id));

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
