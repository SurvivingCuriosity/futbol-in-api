import { Equipo } from "@/models/equipo.model";
import { mapToDTO } from "@/services/equipo.service";
import { EquipoDTO } from "futbol-in-core/types";
import { Types } from "mongoose";

export const findManyById = async (
  idsEquipos: Types.ObjectId[] | undefined
): Promise<EquipoDTO[]> => {
  if (!idsEquipos) return [];
  const equipos = await Equipo.find({ _id: { $in: idsEquipos } });
  return equipos.map((e) => mapToDTO(e));
};
