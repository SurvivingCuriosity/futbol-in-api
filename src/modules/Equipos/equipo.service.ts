import { IEquipoDocument } from "@/models/equipo.model";
import { EquipoDTO } from "futbol-in-core/types";

const mapToDTO = (equipo: IEquipoDocument): EquipoDTO => {
  return {
    id: equipo._id.toString(),
    nombreEquipo: equipo.nombreEquipo,
    imagenEquipo: equipo.imagenEquipo,
    jugadores: equipo.jugadores.map((j) => ({
      nombre: j.nombre,
      usuario: j.usuario?.toString() || null,
      estado: j.estado,
    })),
    createdByUserId: equipo.createdByUserId.toString(),
  };
};

export const EquipoService = {
  mapToDTO,
};
