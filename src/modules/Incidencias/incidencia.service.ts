import { ApiError } from "@/utils/ApiError";
import { UserRole } from "futbol-in-core/enum";
import { Incidencia } from "futbol-in-core/types";
import {
  CrearIncidenciaBody,
  ResolverIncidenciaBody,
} from "futbol-in-core/schemas";
import { Types } from "mongoose";
import { FutbolinModel } from "../Futbolines/futbolin.model";
import { IncidenciaRepository } from "./incidencia.repository";

export type AdminIncidenciaDTO = Incidencia & { spotId: string };

const toDTO = (i: any): Incidencia => ({
  id: String(i._id),
  userId: String(i.userId),
  texto: i.texto ?? "",
  resuelto: !!i.resuelto,
  createdAt: i.createdAt,
});

const crear = async (
  spotId: string,
  body: CrearIncidenciaBody,
  userJwt: { id: string }
) => {
  const spot = await FutbolinModel.exists({ _id: spotId });
  if (!spot) throw new ApiError(404, "Futbolín no encontrado");

  const updated = await IncidenciaRepository.push(spotId, {
    userId: new Types.ObjectId(userJwt.id),
    texto: body.texto ?? "",
  });

  const created = updated?.incidencias?.at(-1);
  if (!created) throw new ApiError(500, "Error al crear incidencia");

  return { spotId, incidencia: toDTO(created) };
};

const resolver = async (
  spotId: string,
  incidenciaId: string,
  body: ResolverIncidenciaBody,
  userJwt: { id: string; role: string[] }
) => {
  if (!userJwt.role?.includes(UserRole.ADMIN)) {
    throw new ApiError(403, "Solo admin puede marcar como resuelto");
  }

  const updated = await IncidenciaRepository.resolveById(
    spotId,
    incidenciaId,
    body.resuelto ?? true
  );
  if (!updated) throw new ApiError(404, "Incidencia no encontrada");

  const inc = updated.incidencias?.find(
    (i: any) => String(i._id) === incidenciaId
  );
  if (!inc) throw new ApiError(404, "Incidencia no encontrada");

  return { spotId, incidencia: toDTO(inc) };
};

const borrar = async (
  spotId: string,
  incidenciaId: string,
  userJwt: { id: string; role: string[] }
) => {
  const inc = await IncidenciaRepository.findIncidenciaInSpot(
    spotId,
    incidenciaId
  );
  if (!inc) throw new ApiError(404, "Incidencia no encontrada");

  const isOwner = String(inc.userId) === userJwt.id;
  const isAdmin = userJwt.role?.includes(UserRole.ADMIN);
  if (!isOwner && !isAdmin)
    throw new ApiError(403, "No autorizado para borrar esta incidencia");

  await IncidenciaRepository.pull(spotId, incidenciaId);
  return { id: incidenciaId };
};

const listarTodasAdmin = async (userJwt: {
  id: string;
  role: string[];
}): Promise<AdminIncidenciaDTO[]> => {
  if (!userJwt.role?.includes(UserRole.ADMIN)) {
    throw new ApiError(403, "Solo admin puede ver todas las incidencias");
  }

  const rows = await FutbolinModel.aggregate([
    { $unwind: "$incidencias" },
    { $match: { "incidencias.resuelto": false } },
    {
      $project: {
        _id: "$incidencias._id",
        spotId: { $toString: "$_id" },
        userId: { $toString: "$incidencias.userId" },
        texto: { $ifNull: ["$incidencias.texto", ""] },
        resuelto: "$incidencias.resuelto",
        createdAt: "$incidencias.createdAt",
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  return rows.map((i: any) => ({
    id: String(i._id),
    spotId: i.spotId,
    userId: i.userId,
    texto: i.texto ?? "",
    resuelto: i.resuelto,
    createdAt: i.createdAt,
  }));
};

export const IncidenciaService = {
  crear,
  listarTodasAdmin,
  resolver,
  borrar,
};
