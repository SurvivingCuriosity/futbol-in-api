import { EquipoService } from './equipo.service';
import { Equipo } from "@/models/equipo.model";
import { EquipoDTO } from "futbol-in-core/types";
import { Types } from "mongoose";

const findManyById = async (
  idsEquipos: Types.ObjectId[] | undefined
): Promise<EquipoDTO[]> => {
  if (!idsEquipos) return [];
  const equipos = await Equipo.find({ _id: { $in: idsEquipos } });
  return equipos.map((e) => EquipoService.mapToDTO(e));
};

export const EquipoRepository = {
  findManyById,
};
