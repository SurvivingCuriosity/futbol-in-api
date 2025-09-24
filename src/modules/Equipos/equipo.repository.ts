import { EquipoService } from './equipo.service';
import { EquipoDTO } from "futbol-in-core/types";
import { Types } from "mongoose";
import { Equipo } from './equipo.model';

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
