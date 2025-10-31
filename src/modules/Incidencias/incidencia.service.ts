import { ApiError } from "@/utils/ApiError";
import { UserRole } from "futbol-in-core/enum";
import {
  CrearIncidenciaBody,
  ResolverIncidenciaBody,
} from "futbol-in-core/schemas";
import { Types } from "mongoose";
import { FutbolinModel } from "../Futbolines/futbolin.model";
import { IncidenciaRepository } from "./incidencia.repository";

export type IncidenciaDTO = {
  id: string;
  spotId: string;
  userId: string;
  texto: string;
  resuelto: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const toDTO = (i: any): IncidenciaDTO => ({
  id: String(i._id),
  spotId: String(i.spotId),
  userId: String(i.userId),
  texto: i.texto ?? "",
  resuelto: !!i.resuelto,
  createdAt: i.createdAt,
  updatedAt: i.updatedAt,
});

const crear = async (body: CrearIncidenciaBody, userJwt: { id: string }) => {
  // sanity: spot existe
  const exists = await FutbolinModel.exists({ _id: body.spotId });
  if (!exists) throw new ApiError(404, "Futbolín no encontrado");

  const doc = await IncidenciaRepository.create({
    spotId: new Types.ObjectId(body.spotId as string),
    userId: new Types.ObjectId(userJwt.id),
    texto: body.texto ?? "",
  });
  return toDTO(doc);
};

const listarTodas = async (userJwt: { id: string; role: string[] }) => {
  if (!userJwt.role?.includes(UserRole.ADMIN)) {
    throw new ApiError(403, "Solo admin puede ver todas las incidencias");
  }
  const docs = await IncidenciaRepository.findAll();
  return docs.map(toDTO);
};

const listarPorFutbolin = async (spotId: string) => {
  const docs = await IncidenciaRepository.findBySpotId(spotId);
  return docs.map(toDTO);
};

const resolver = async (
  id: string,
  body: ResolverIncidenciaBody,
  userJwt: { id: string; role: string[] }
) => {
  if (!userJwt.role?.includes(UserRole.ADMIN)) {
    throw new ApiError(403, "Solo admin puede marcar como resuelto");
  }
  const updated = await IncidenciaRepository.resolveById(
    id,
    body.resuelto ?? true
  );
  if (!updated) throw new ApiError(404, "Incidencia no encontrada");
  return toDTO(updated);
};

const borrar = async (id: string, userJwt: { id: string; role: string[] }) => {
  const found = await IncidenciaRepository.findById(id);
  if (!found) throw new ApiError(404, "Incidencia no encontrada");

  const isOwner = String(found.userId) === userJwt.id;
  const isAdmin = userJwt.role?.includes(UserRole.ADMIN);

  if (!isOwner && !isAdmin)
    throw new ApiError(403, "No autorizado para borrar esta incidencia");

  await IncidenciaRepository.removeById(id);
  return { id };
};

export const IncidenciaService = {
  crear,
  listarTodas,
  listarPorFutbolin,
  resolver,
  borrar,
};
